import { Bc as PendingTasks, Ec as InjectionToken, El as ɵɵdefineInjectable, En as ElementRef, Fn as Injectable, Lc as PLATFORM_ID, Ui as setClassMetadata, X as input, an as ChangeDetectionStrategy, at as output, cn as Component, eo as ɵɵdefineComponent, hc as DestroyRef, nt as model, oa as ɵɵHostDirectivesFeature, pl as makeEnvironmentProviders, qt as untracked, sl as inject, tl as effect, to as ɵɵdefineDirective, wn as Directive, xl as signal } from "./core-7suaIGWo.js";
import { d as isPlatformServer } from "./common-B65YdUen.js";
//#region node_modules/highcharts-angular/fesm2022/highcharts-angular.mjs
var HIGHCHARTS_LOADER = new InjectionToken("HIGHCHARTS_LOADER");
var HIGHCHARTS_ROOT_MODULES = new InjectionToken("HIGHCHARTS_ROOT_MODULES");
var HIGHCHARTS_OPTIONS = new InjectionToken("HIGHCHARTS_OPTIONS");
var HIGHCHARTS_CONFIG = new InjectionToken("HIGHCHARTS_CONFIG");
var HIGHCHARTS_TIMEOUT = new InjectionToken("HIGHCHARTS_TIMEOUT");
var HighchartsChartService = class HighchartsChartService {
	constructor() {
		this.highcharts = signal(null);
		this.loader = inject(HIGHCHARTS_LOADER);
		this.globalOptions = inject(HIGHCHARTS_OPTIONS, { optional: true });
		this.globalModules = inject(HIGHCHARTS_ROOT_MODULES, { optional: true });
		this.sharedHighchartsPromise = null;
		this.moduleLoadCache = /* @__PURE__ */ new WeakMap();
	}
	async loadModules(modulesFactory) {
		if (!modulesFactory) return;
		const cachedLoad = this.moduleLoadCache.get(modulesFactory);
		if (cachedLoad) return cachedLoad;
		const moduleLoad = Promise.allSettled(modulesFactory()).then((moduleResults) => {
			const rejectedModules = moduleResults.filter((result) => result.status === "rejected");
			if (rejectedModules.length) {
				const reasons = rejectedModules.map(({ reason }) => reason instanceof Error ? reason.message : String(reason));
				throw new Error(`Failed to load Highcharts modules: ${reasons.join("; ")}`);
			}
		});
		this.moduleLoadCache.set(modulesFactory, moduleLoad);
		moduleLoad.catch(() => {
			if (this.moduleLoadCache.get(modulesFactory) === moduleLoad) this.moduleLoadCache.delete(modulesFactory);
		});
		return moduleLoad;
	}
	async ensureSharedHighcharts() {
		if (!this.sharedHighchartsPromise) {
			const load = (async () => {
				const highcharts = await this.loader();
				await this.loadModules(this.globalModules);
				if (this.globalOptions) highcharts.setOptions(this.globalOptions);
				return highcharts;
			})();
			this.sharedHighchartsPromise = load;
			load.catch(() => {
				if (this.sharedHighchartsPromise === load) this.sharedHighchartsPromise = null;
			});
		}
		return this.sharedHighchartsPromise;
	}
	async load(partialConfig) {
		const highcharts = await this.ensureSharedHighcharts();
		await this.loadModules(partialConfig?.modules);
		this.highcharts.set(highcharts);
		return highcharts;
	}
	static {
		this.ɵfac = function HighchartsChartService_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || HighchartsChartService)();
		};
	}
	static {
		this.ɵprov = /* @__PURE__ */ ɵɵdefineInjectable({
			token: HighchartsChartService,
			factory: HighchartsChartService.ɵfac,
			providedIn: "root"
		});
	}
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HighchartsChartService, [{
		type: Injectable,
		args: [{ providedIn: "root" }]
	}], null, null);
})();
var HighchartsChartDirective = class HighchartsChartDirective {
	delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
	getChartFactory(highcharts, constructorType) {
		if (constructorType === "chart") return highcharts.chart;
		const chartFactory = highcharts[constructorType];
		if (!chartFactory) throw new Error(`Highcharts constructor "${constructorType}" is not available. Did you load the required module?`);
		return chartFactory;
	}
	createChart() {
		effect((onCleanup) => {
			const highcharts = this.loadedHighcharts();
			const constructorType = this.constructorType();
			if (!highcharts || this.isDestroyed) return;
			const callback = (chart) => {
				if (chart.renderer.forExport || this.isDestroyed) return;
				return this.chartInstance.emit(chart);
			};
			const chart = this.getChartFactory(highcharts, constructorType)(this.el.nativeElement, untracked(() => this.options()), callback);
			this.chart.set(chart);
			onCleanup(() => {
				if (this.chart() === chart) this.chart.set(null);
				chart.destroy();
			});
		});
	}
	keepChartUpToDate() {
		let lastChart = null;
		effect(() => {
			const chart = this.chart();
			const update = this.update();
			const oneToOne = this.oneToOne();
			const options = this.options();
			if (!chart) return;
			if (chart !== lastChart) {
				lastChart = chart;
				return;
			}
			if (update) chart.update(options, true, oneToOne);
		});
	}
	async initializeHighcharts() {
		await this.pendingTasks.run(async () => {
			try {
				const highcharts = await this.highchartsChartService.load(this.relativeConfig);
				const delayMs = this.relativeConfig?.timeout ?? this.timeout ?? 0;
				if (delayMs > 0) await this.delay(delayMs);
				if (!this.isDestroyed) this.loadedHighcharts.set(highcharts);
			} catch (error) {
				console.error("Highcharts failed to load; chart was not created.", error);
			}
		});
	}
	constructor() {
		/**
		* Type of the chart constructor.
		* Changing it recreates the chart because Highcharts constructors are not update-compatible.
		*/
		this.constructorType = input("chart");
		/**
		* @deprecated Will be removed in a future release.
		* When enabled, Updates `series`, `xAxis`, `yAxis`, and `annotations` to match new options.
		* Items are added/removed as needed. Series with `id`s are matched by `id`;
		* unmatched items are removed. Omitted `series` leaves existing ones unchanged.
		*/
		this.oneToOne = input(false);
		/**
		* Options for the Highcharts chart.
		*/
		this.options = input.required();
		/**
		* @deprecated Will be removed in a future release.
		* Whether to redraw the chart.
		* Check how update works in Highcharts
		* API doc here: https://api.highcharts.com/class-reference/Highcharts.Chart#update
		*/
		this.update = model(true);
		this.chartInstance = output();
		this.destroyRef = inject(DestroyRef);
		this.el = inject(ElementRef);
		this.platformId = inject(PLATFORM_ID);
		this.relativeConfig = inject(HIGHCHARTS_CONFIG, { optional: true });
		this.timeout = inject(HIGHCHARTS_TIMEOUT, { optional: true });
		this.highchartsChartService = inject(HighchartsChartService);
		this.pendingTasks = inject(PendingTasks);
		this.loadedHighcharts = signal(null);
		this.chart = signal(null);
		this.isDestroyed = false;
		if (this.platformId && isPlatformServer(this.platformId)) return;
		this.destroyRef.onDestroy(() => {
			this.isDestroyed = true;
		});
		this.createChart();
		this.keepChartUpToDate();
		this.initializeHighcharts();
	}
	static {
		this.ɵfac = function HighchartsChartDirective_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || HighchartsChartDirective)();
		};
	}
	static {
		this.ɵdir = /* @__PURE__ */ ɵɵdefineDirective({
			type: HighchartsChartDirective,
			selectors: [[
				"",
				"highchartsChart",
				""
			]],
			inputs: {
				constructorType: [1, "constructorType"],
				oneToOne: [1, "oneToOne"],
				options: [1, "options"],
				update: [1, "update"]
			},
			outputs: {
				update: "updateChange",
				chartInstance: "chartInstance"
			}
		});
	}
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HighchartsChartDirective, [{
		type: Directive,
		args: [{ selector: "[highchartsChart]" }]
	}], () => [], null);
})();
var HighchartsChartComponent = class HighchartsChartComponent {
	static {
		this.ɵfac = function HighchartsChartComponent_Factory(__ngFactoryType__) {
			return new (__ngFactoryType__ || HighchartsChartComponent)();
		};
	}
	static {
		this.ɵcmp = /* @__PURE__ */ ɵɵdefineComponent({
			type: HighchartsChartComponent,
			selectors: [["highcharts-chart"]],
			features: [ɵɵHostDirectivesFeature([{
				directive: HighchartsChartDirective,
				inputs: [
					"constructorType",
					"constructorType",
					"oneToOne",
					"oneToOne",
					"options",
					"options",
					"update",
					"update"
				],
				outputs: [
					"chartInstance",
					"chartInstance",
					"updateChange",
					"updateChange"
				]
			}])],
			decls: 0,
			vars: 0,
			template: function HighchartsChartComponent_Template(rf, ctx) {},
			encapsulation: 2
		});
	}
};
(() => {
	(typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HighchartsChartComponent, [{
		type: Component,
		args: [{
			selector: "highcharts-chart",
			template: "",
			hostDirectives: [{
				directive: HighchartsChartDirective,
				inputs: [
					"constructorType",
					"oneToOne",
					"options",
					"update"
				],
				outputs: ["chartInstance", "updateChange"]
			}],
			changeDetection: ChangeDetectionStrategy.OnPush
		}]
	}], null, null);
})();
var emptyModuleFactoryFunction = () => [];
var defaultInstanceFactoryFunction = () => import("./highcharts.js").then((m) => m.default);
function provideHighchartsInstance(instance) {
	return makeEnvironmentProviders([{
		provide: HIGHCHARTS_LOADER,
		useValue: instance ?? defaultInstanceFactoryFunction
	}]);
}
function provideHighchartsOptions(options) {
	return makeEnvironmentProviders([{
		provide: HIGHCHARTS_OPTIONS,
		useValue: options
	}]);
}
function provideHighchartsRootModules(modules) {
	return makeEnvironmentProviders([{
		provide: HIGHCHARTS_ROOT_MODULES,
		useValue: modules
	}]);
}
function providePartialHighcharts(config) {
	return {
		provide: HIGHCHARTS_CONFIG,
		useValue: config
	};
}
function provideHighcharts(config = {}) {
	const providers = [
		provideHighchartsInstance(config.instance),
		provideHighchartsRootModules(config.modules ?? emptyModuleFactoryFunction),
		{
			provide: HIGHCHARTS_TIMEOUT,
			useValue: config.timeout
		}
	];
	if (config.options) providers.push(provideHighchartsOptions(config.options));
	return makeEnvironmentProviders(providers);
}
//#endregion
export { HighchartsChartComponent, HighchartsChartDirective, provideHighcharts, providePartialHighcharts };
