import * as fs from 'node:fs/promises'
import * as process from 'node:process'
import * as yaml from 'yaml'

interface SourceConfig {
  repo: string
  ref: string
  path: string
}

interface CoverageItem {
  lines: string
  linesExcluded?: string
  ignore?: boolean
  comment?: string
}

interface Config {
  source: SourceConfig
  coverage: CoverageItem[]
}

function parseCoverageLines(linesStr: string): Set<number> {
  const result = new Set<number>()
  const parts = linesStr.split(',')

  for (const part of parts) {
    const trimmed = part.trim()
    if (trimmed.includes('-')) {
      const [start, end] = trimmed.split('-').map(n => Number.parseInt(n, 10))
      for (let i = start!; i <= end!; i++) {
        result.add(i)
      }
    }
    else {
      result.add(Number.parseInt(trimmed, 10))
    }
  }

  return result
}

interface CoverageData {
  comment?: string
  ignore: boolean
}

function buildCoverageMap(coverage: CoverageItem[]): Map<number, CoverageData> {
  const map = new Map<number, CoverageData>()

  for (const item of coverage) {
    const lines = parseCoverageLines(item.lines).difference(item.linesExcluded ? parseCoverageLines(item.linesExcluded) : new Set<number>())
    for (const line of lines) {
      map.set(line, {
        comment: item.comment,
        ignore: item.ignore || false,
      })
    }
  }

  return map
}

async function fetchUrl(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`)
  }
  return await response.text()
}

function isWhitespaceOnly(line: string): boolean {
  return line.trim().length === 0
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function generateHtml(sourceCode: string, coverageMap: Map<number, CoverageData>): string {
  const lines = sourceCode.split('\n')
  const totalLines = lines.length
  const coveredLines = new Set<number>()
  const whitespaceLines = new Set<number>()
  const ignoredLines = new Set<number>()

  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1
    const coverageData = coverageMap.get(lineNum)

    if (isWhitespaceOnly(lines[i]!)) {
      whitespaceLines.add(lineNum)
    }
    else if (coverageData?.ignore) {
      ignoredLines.add(lineNum)
    }
    else if (coverageData && !isWhitespaceOnly(lines[i]!)) {
      coveredLines.add(lineNum)
    }
  }

  const relevantLines = totalLines - whitespaceLines.size - ignoredLines.size
  const coveragePercent = relevantLines > 0
    ? ((coveredLines.size / relevantLines) * 100).toFixed(2)
    : '0.00'
  const coverageStats = `${coveragePercent}% (${coveredLines.size}/${relevantLines})`

  const htmlLines: string[] = []
  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1
    const lineContent = escapeHtml(lines[i]!)
    const isWhitespace = whitespaceLines.has(lineNum)
    const coverageData = coverageMap.get(lineNum)
    const isIgnored = coverageData?.ignore || false
    const isCovered = coverageData && !isIgnored

    let cssClass = 'uncovered'
    let dataComment = ''

    if (isCovered) {
      cssClass = 'covered'
      if (coverageData.comment) {
        const comment = escapeHtml(coverageData.comment)
        dataComment = ` data-comment="${comment}"`
      }
    }
    else if (isIgnored) {
      cssClass = 'ignored'
      if (coverageData?.comment) {
        const comment = escapeHtml(coverageData.comment)
        dataComment = ` data-comment="${comment}"`
      }
    }
    else if (isWhitespace) {
      cssClass = 'whitespace'
    }

    htmlLines.push(`<div class="line ${cssClass}"${dataComment}><span class="line-number">${lineNum}</span><span class="line-content">${lineContent}</span></div>\n`)
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Coverage Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 13px;
      line-height: 1.5;
      background: #1e1e1e;
      color: #d4d4d4;
    }
    .header {
      background: #252526;
      padding: 20px;
      border-bottom: 1px solid #3e3e42;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .coverage-stat {
      font-size: 24px;
      font-weight: bold;
    }
    .coverage-stat .percent {
      color: #4ec9b0;
    }
    .code-container {
      padding: 10px 0;
    }
    .line {
      display: flex;
      padding: 0 20px;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .line-number {
      display: inline-block;
      width: 60px;
      text-align: right;
      padding-right: 20px;
      user-select: none;
      color: #858585;
      flex-shrink: 0;
    }
    .line-content {
      flex: 1;
    }
    .line.covered {
      background: rgba(0, 255, 0, 0.1);
      cursor: help;
      position: relative;
    }
    .line.covered .line-content {
      color: #b5cea8;
    }
    .line.covered[data-comment]:hover::after {
      content: attr(data-comment);
      position: absolute;
      left: 80px;
      top: 100%;
      background: #2d2d30;
      color: #ffffff;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      white-space: normal;
      max-width: 400px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
      border: 1px solid #3e3e42;
      z-index: 1000;
      margin-top: 4px;
    }
    .line.uncovered {
      background: rgba(255, 0, 0, 0.1);
    }
    .line.uncovered .line-content {
      color: #f48771;
    }
    .line.ignored {
      background: transparent;
      position: relative;
    }
    .line.ignored .line-content {
      color: #6a6a6a;
    }
    .line.ignored[data-comment] {
      cursor: help;
    }
    .line.ignored[data-comment]:hover::after {
      content: attr(data-comment);
      position: absolute;
      left: 80px;
      top: 100%;
      background: #2d2d30;
      color: #ffffff;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      white-space: normal;
      max-width: 400px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
      border: 1px solid #3e3e42;
      z-index: 1000;
      margin-top: 4px;
    }
    .line.whitespace {
      background: transparent;
    }
    .line.whitespace .line-content {
      color: #6a6a6a;
    }
    .line.covered:hover {
      background: rgba(0, 255, 0, 0.2);
    }
    .line.ignored[data-comment]:hover {
      background: rgba(128, 128, 128, 0.1);
    }
    .legend {
      margin-top: 10px;
      font-size: 12px;
      color: #858585;
    }
    .legend-item {
      display: inline-block;
      margin-right: 20px;
    }
    .legend-color {
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-right: 5px;
      vertical-align: middle;
    }
    .legend-covered { background: rgba(0, 255, 0, 0.3); }
    .legend-uncovered { background: rgba(255, 0, 0, 0.3); }
    .legend-ignored { background: rgba(128, 128, 128, 0.3); }
  </style>
</head>
<body>
  <div class="header">
    <div class="coverage-stat">
      Coverage: <span class="percent">${coverageStats}</span>
    </div>
    <div class="legend">
      <span class="legend-item"><span class="legend-color legend-covered"></span>Covered</span>
      <span class="legend-item"><span class="legend-color legend-uncovered"></span>Uncovered</span>
      <span class="legend-item"><span class="legend-color legend-ignored"></span>Irrelevant</span>
    </div>
  </div>
  <div class="code-container">
    ${htmlLines.join('\n')}
  </div>
</body>
</html>`
}

async function generateReport(configPath: string, outputPath: string): Promise<void> {
  console.log('Reading config...')
  const configContent = await fs.readFile(configPath, 'utf-8')
  const config = yaml.parse(configContent) as Config

  console.log('Building coverage map...')
  const coverageMap = buildCoverageMap(config.coverage)

  const url = `https://raw.githubusercontent.com/${config.source.repo}/${config.source.ref}/${config.source.path}`
  console.log(`Fetching source from: ${url}`)
  const sourceCode = await fetchUrl(url)

  console.log('Generating HTML report...')
  const html = generateHtml(sourceCode, coverageMap)

  await fs.writeFile(outputPath, html, 'utf-8')
  console.log(`Report generated: ${outputPath}`)
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const command = args[0]

  if (command === 'generate-report') {
    const configPath = args[1] || 'telegram-web-app.yml'
    const outputPath = args[2] || 'coverage-report.html'

    await generateReport(configPath, outputPath)
  }
  else {
    console.error('Unknown command. Available commands: generate-report')
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Error:', error.message)
  process.exit(1)
})
