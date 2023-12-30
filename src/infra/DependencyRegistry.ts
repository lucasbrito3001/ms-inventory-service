export class DependencyRegistry {
	dependencies: Map<string, any> = new Map();

	push(name: string, dependency: any): void {
		this.dependencies.set(name, dependency);
	}

	inject(name: string): any {
		return this.dependencies.get(name);
	}
}
