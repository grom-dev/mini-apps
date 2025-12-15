export interface Tag<TId extends string, TService> { Id: TId, Service: TService }

export const tag = <TId extends string, TService>(id: TId): Tag<TId, TService> => ({
  Id: id,
  Service: null as any,
})

export const DisposeSymbol = Symbol.for('@grom.js/mini-app/Dispose')
export type DisposeFn = () => void

export interface Disposable {
  [DisposeSymbol]: DisposeFn
}

type DepsResolved<TDeps extends Record<string, Tag<any, any>>> = {
  [K in keyof TDeps]: TDeps[K] extends Tag<any, infer T> ? T : never
}

type DepsTags<TDeps extends Record<string, Tag<any, any>>> = {
  [K in keyof TDeps]: TDeps[K] extends Tag<infer Id, infer Type> ? Tag<Id, Type> : never
}[keyof TDeps]

export type ServiceMap<TTag extends Tag<any, any>> = {
  [Id in TTag['Id']]: Extract<TTag, { Id: Id }>['Service']
} & {
  $dispose: () => void
}

interface DependencyDefinition {
  tag: Tag<any, any>
  dependencies: Record<string, Tag<any, any>>
  factory: (dependencies: any) => any
}

export class Container<
  TDepsOut extends Tag<any, any> = never,
  TDepsIn extends Tag<any, any> = never,
> {
  private readonly definitions: Record<string, DependencyDefinition>

  constructor() {
    this.definitions = {}
  }

  public provide<TId extends string, TDep, TDeps extends Record<string, Tag<any, any>>>(
    tag: Tag<TId, TDep>,
    dependencies: TDeps,
    factory: (dependencies: DepsResolved<TDeps>) => TDep,
  ): Container<TDepsOut | Tag<TId, TDep>, Exclude<DepsTags<TDeps>, TDepsOut>> {
    if (tag.Id in this.definitions) {
      throw new Error(`"${tag.Id}" has been already provided.`)
    }
    this.definitions[tag.Id] = { tag, dependencies, factory }
    return this as any
  }

  public build(): (
    [TDepsIn] extends [never]
      ? ServiceMap<TDepsOut>
      : never
  ) {
    const services = {}
    const building = new Set<string>()
    const buildService = (id: string): any => {
      if (id in services) {
        return services[id]
      }
      if (building.has(id)) {
        throw new Error(`Dependency "${id}" circularly depends on itself.`)
      }
      const definition = this.definitions[id]
      if (!definition) {
        throw new Error(`Dependency "${id}" was not provided.`)
      }
      building.add(id)
      try {
        const resolvedDeps: Record<string, any> = {}
        for (const [key, depTag] of Object.entries(definition.dependencies)) {
          resolvedDeps[key] = buildService(depTag.Id)
        }
        const service = definition.factory(resolvedDeps)
        services[id] = service
        return service
      }
      finally {
        building.delete(id)
      }
    }
    for (const id of Object.keys(this.definitions)) {
      buildService(id)
    }
    // disposing
    let disposed = false
    const $dispose = () => {
      Object
        .keys(services)
        .reverse()
        .forEach((id) => {
          const service = services[id]
          if (
            typeof service === 'object'
            && service !== null
            && DisposeSymbol in service
            && typeof service[DisposeSymbol] === 'function'
          ) {
            try {
              service[DisposeSymbol]()
            }
            catch (error) {
              console.error(error)
            }
          }
          delete services[id]
        })
      disposed = true
    }
    return new Proxy(services, {
      get: (target, prop) => {
        if (disposed) {
          throw new Error('Cannot access properties after calling $dispose.')
        }
        if (prop === '$dispose') {
          return $dispose
        }
        return target[prop]
      },
    }) as any
  }
}
