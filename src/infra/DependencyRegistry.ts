export class DependencyRegistry {
	dependencies: Map<string, any> = new Map();

	push(name: string, dependency: any): this {
		this.dependencies.set(name, dependency);
		return this;
	}

	inject(name: string): any {
		return this.dependencies.get(name);
	}
}
