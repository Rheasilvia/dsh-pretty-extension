window.__ModuleLoader__.load({
	id: "dsh-pretty-extension",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region node_modules/.pnpm/@deepseek-ai+cosmokit@1.8.6-alpha.1/node_modules/@deepseek-ai/cosmokit/lib/index.js
		/** Return true when a value is `null` or `undefined`. */
		function isNullable(value) {
			return value === null || value === void 0;
		}
		/** Return true for non-array object values. */
		function isPlainObject(data) {
			return data && typeof data === "object" && !Array.isArray(data);
		}
		/** Filter object entries and return a new object. */
		function filterKeys(object, filter) {
			return Object.fromEntries(Object.entries(object).filter(([key, value]) => filter(key, value)));
		}
		/** Map object values while preserving the original key set. */
		function mapValues(object, transform) {
			return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transform(value, key)]));
		}
		/** Pick selected keys from an object, optionally including `undefined` values. */
		function pick(source, keys, forced) {
			if (!keys) return { ...source };
			const result = {};
			for (const key of keys) if (forced || source[key] !== void 0) result[key] = source[key];
			return result;
		}
		/** Shared config references used by schema validators and plugin runtimes. */
		const write = Symbol.for("cosmokit.volatile.write");
		function snapshot(value, ancestors = /* @__PURE__ */ new Set()) {
			if (typeof value === "function") throw new TypeError("volatile config cannot contain functions");
			if (value === null || typeof value !== "object") return value;
			if (ancestors.has(value)) throw new TypeError("volatile config cannot contain cycles");
			ancestors.add(value);
			try {
				if (Array.isArray(value)) return Object.freeze(value.map((item) => snapshot(item, ancestors)));
				if (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) throw new TypeError("volatile config objects must be plain objects or arrays");
				return Object.freeze(Object.fromEntries(Object.entries(value).map(([key, item]) => [key, snapshot(item, ancestors)])));
			} finally {
				ancestors.delete(value);
			}
		}
		/**
		* Create a detached reference containing an immutable copy of the supplied data.
		* @param value - validated config data; class instances and functions are unsupported.
		* @returns a reference whose value is updated only by its owning runtime.
		*/
		function createVolatile(value) {
			let current = snapshot(value);
			return Object.freeze({
				get: () => current,
				[write]: (value) => {
					current = value;
				}
			});
		}
		/**
		* Identify references across ESM/CJS copies of the shared library.
		* @param value - a parsed config value.
		* @returns whether the value implements the shared reference protocol.
		*/
		function isVolatile(value) {
			return typeof value === "object" && value !== null && write in value;
		}
		/** Test values using `instanceof` with a `toStringTag` fallback. */
		function is(type, value) {
			if (arguments.length === 1) return (value) => is(type, value);
			return type in globalThis && value instanceof globalThis[type] || Object.prototype.toString.call(value).slice(8, -1) === type;
		}
		function isArrayBufferLike(value) {
			return is("ArrayBuffer", value) || is("SharedArrayBuffer", value);
		}
		function isArrayBufferSource(value) {
			return isArrayBufferLike(value) || ArrayBuffer.isView(value);
		}
		/** Binary source detection and base64/hex conversion helpers. */
		var Binary;
		(function(Binary) {
			Binary.is = isArrayBufferLike;
			Binary.isSource = isArrayBufferSource;
			function fromSource(source) {
				if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
				else return source;
			}
			Binary.fromSource = fromSource;
			function toBase64(source) {
				source = fromSource(source);
				if (typeof Buffer !== "undefined") return Buffer.from(source).toString("base64");
				let binary = "";
				const bytes = new Uint8Array(source);
				for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
				return btoa(binary);
			}
			Binary.toBase64 = toBase64;
			function fromBase64(source) {
				if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "base64"));
				return Uint8Array.from(atob(source), (c) => c.charCodeAt(0));
			}
			Binary.fromBase64 = fromBase64;
			function toHex(source) {
				source = fromSource(source);
				if (typeof Buffer !== "undefined") return Buffer.from(source).toString("hex");
				return Array.from(new Uint8Array(source), (byte) => byte.toString(16).padStart(2, "0")).join("");
			}
			Binary.toHex = toHex;
			function fromHex(source) {
				if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "hex"));
				const hex = source.length % 2 === 0 ? source : source.slice(0, source.length - 1);
				const buffer = [];
				for (let i = 0; i < hex.length; i += 2) buffer.push(parseInt(`${hex[i]}${hex[i + 1]}`, 16));
				return Uint8Array.from(buffer).buffer;
			}
			Binary.fromHex = fromHex;
		})(Binary || (Binary = {}));
		Binary.fromBase64;
		Binary.toBase64;
		Binary.fromHex;
		Binary.toHex;
		/** Deep-clone common JavaScript values while preserving prototypes and cycles. */
		function clone(source, refs = /* @__PURE__ */ new Map()) {
			if (!source || typeof source !== "object") return source;
			if (is("Date", source)) return new Date(source.valueOf());
			if (is("RegExp", source)) return new RegExp(source.source, source.flags);
			if (isArrayBufferLike(source)) return source.slice(0);
			if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
			const cached = refs.get(source);
			if (cached) return cached;
			if (Array.isArray(source)) {
				const result = [];
				refs.set(source, result);
				source.forEach((value, index) => {
					result[index] = Reflect.apply(clone, null, [value, refs]);
				});
				return result;
			}
			const result = Object.create(Object.getPrototypeOf(source));
			refs.set(source, result);
			for (const key of Reflect.ownKeys(source)) {
				const descriptor = { ...Reflect.getOwnPropertyDescriptor(source, key) };
				if ("value" in descriptor) descriptor.value = Reflect.apply(clone, null, [descriptor.value, refs]);
				Reflect.defineProperty(result, key, descriptor);
			}
			return result;
		}
		/**
		* Compare values recursively, treating two volatile references as equal regardless of value.
		* Strict comparison distinguishes null/undefined, treats opaque objects by identity,
		* compares URLs by normalized href, treats array holes as undefined, and considers distinct cyclic structures unequal.
		* @param a - first value.
		* @param b - second value.
		* @param strict - whether to require strict data equality outside volatile references.
		* @returns whether the values compare equal.
		*/
		function deepEqual(a, b, strict) {
			const ancestors = /* @__PURE__ */ new Set();
			function compare(a, b) {
				if (a === b) return true;
				if (isVolatile(a) || isVolatile(b)) return isVolatile(a) && isVolatile(b);
				if (!strict && isNullable(a) && isNullable(b)) return true;
				if (typeof a !== typeof b || typeof a !== "object" || !a || !b) return false;
				if (ancestors.has(a)) return false;
				function check(test, then) {
					return test(a) ? test(b) ? then(a, b) : false : test(b) ? false : void 0;
				}
				ancestors.add(a);
				try {
					return check(Array.isArray, (a, b) => {
						if (a.length !== b.length) return false;
						for (let index = 0; index < a.length; index++) if (!compare(a[index], b[index])) return false;
						return true;
					}) ?? check(is("Date"), (a, b) => a.valueOf() === b.valueOf()) ?? check(is("URL"), (a, b) => a.href === b.href) ?? check(is("RegExp"), (a, b) => a.source === b.source && a.flags === b.flags) ?? check(isArrayBufferLike, (a, b) => {
						if (a.byteLength !== b.byteLength) return false;
						const viewA = new Uint8Array(a);
						const viewB = new Uint8Array(b);
						for (let i = 0; i < viewA.length; i++) if (viewA[i] !== viewB[i]) return false;
						return true;
					}) ?? ((!strict || [a, b].every((value) => Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null)) && Object.keys({
						...a,
						...b
					}).every((key) => compare(a[key], b[key])));
				} finally {
					ancestors.delete(a);
				}
			}
			return compare(a, b);
		}
		/** Time constants plus parsing and formatting helpers. */
		var Time;
		(function(Time) {
			Time.millisecond = 1;
			Time.second = 1e3;
			Time.minute = Time.second * 60;
			Time.hour = Time.minute * 60;
			Time.day = Time.hour * 24;
			Time.week = Time.day * 7;
			let timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
			function setTimezoneOffset(offset) {
				timezoneOffset = offset;
			}
			Time.setTimezoneOffset = setTimezoneOffset;
			function getTimezoneOffset() {
				return timezoneOffset;
			}
			Time.getTimezoneOffset = getTimezoneOffset;
			function getDateNumber(date = /* @__PURE__ */ new Date(), offset) {
				if (typeof date === "number") date = new Date(date);
				if (offset === void 0) offset = timezoneOffset;
				return Math.floor((date.valueOf() / Time.minute - offset) / 1440);
			}
			Time.getDateNumber = getDateNumber;
			function fromDateNumber(value, offset) {
				const date = new Date(value * Time.day);
				if (offset === void 0) offset = timezoneOffset;
				return new Date(+date + offset * Time.minute);
			}
			Time.fromDateNumber = fromDateNumber;
			const numeric = /\d+(?:\.\d+)?/.source;
			const timeRegExp = new RegExp(`^${[
				"w(?:eek(?:s)?)?",
				"d(?:ay(?:s)?)?",
				"h(?:our(?:s)?)?",
				"m(?:in(?:ute)?(?:s)?)?",
				"s(?:ec(?:ond)?(?:s)?)?"
			].map((unit) => `(${numeric}${unit})?`).join("")}$`);
			function parseTime(source) {
				const capture = timeRegExp.exec(source);
				if (!capture) return 0;
				return (parseFloat(capture[1]) * Time.week || 0) + (parseFloat(capture[2]) * Time.day || 0) + (parseFloat(capture[3]) * Time.hour || 0) + (parseFloat(capture[4]) * Time.minute || 0) + (parseFloat(capture[5]) * Time.second || 0);
			}
			Time.parseTime = parseTime;
			function parseDate(date) {
				const parsed = parseTime(date);
				if (parsed) date = Date.now() + parsed;
				else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date)) date = `${(/* @__PURE__ */ new Date()).toLocaleDateString()}-${date}`;
				else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date)) date = `${(/* @__PURE__ */ new Date()).getFullYear()}-${date}`;
				return date ? new Date(date) : /* @__PURE__ */ new Date();
			}
			Time.parseDate = parseDate;
			function format(ms) {
				const abs = Math.abs(ms);
				if (abs >= Time.day - Time.hour / 2) return Math.round(ms / Time.day) + "d";
				else if (abs >= Time.hour - Time.minute / 2) return Math.round(ms / Time.hour) + "h";
				else if (abs >= Time.minute - Time.second / 2) return Math.round(ms / Time.minute) + "m";
				else if (abs >= Time.second) return Math.round(ms / Time.second) + "s";
				return ms + "ms";
			}
			Time.format = format;
			function toDigits(source, length = 2) {
				return source.toString().padStart(length, "0");
			}
			Time.toDigits = toDigits;
			function template(template, time = /* @__PURE__ */ new Date()) {
				return template.replace("yyyy", time.getFullYear().toString()).replace("yy", time.getFullYear().toString().slice(2)).replace("MM", toDigits(time.getMonth() + 1)).replace("dd", toDigits(time.getDate())).replace("hh", toDigits(time.getHours())).replace("mm", toDigits(time.getMinutes())).replace("ss", toDigits(time.getSeconds())).replace("SSS", toDigits(time.getMilliseconds(), 3));
			}
			Time.template = template;
		})(Time || (Time = {}));
		//#endregion
		//#region node_modules/.pnpm/@deepseek-ai+schemastery@3.18.5-alpha.1/node_modules/@deepseek-ai/schemastery/lib/index.mjs
		const kSchema = Symbol.for("schemastery");
		const kValidationError = Symbol.for("ValidationError");
		globalThis.__schemastery_index__ ??= 0;
		globalThis.__schemastery_refs__ = void 0;
		var ValidationError = class extends TypeError {
			options;
			name = "ValidationError";
			constructor(message, options) {
				let prefix = "$";
				for (const segment of options.path || []) if (typeof segment === "string") prefix += "." + segment;
				else if (typeof segment === "number") prefix += "[" + segment + "]";
				else if (typeof segment === "symbol") prefix += `[Symbol(${segment.toString()})]`;
				if (prefix.startsWith(".")) prefix = prefix.slice(1);
				super((prefix === "$" ? "" : `${prefix} `) + message);
				this.options = options;
			}
			static is(error) {
				return !!error?.[kValidationError];
			}
		};
		Object.defineProperty(ValidationError.prototype, kValidationError, { value: true });
		const Schema = function(options) {
			const schema = function(data, options = {}) {
				return Schema.resolve(data, schema, options)[0];
			};
			if (options.refs) {
				const refs = mapValues(options.refs, (options) => new Schema(options));
				const getRef = (uid) => refs[uid];
				for (const key in refs) {
					const options = refs[key];
					options.sKey = getRef(options.sKey);
					options.inner = getRef(options.inner);
					options.list = options.list && options.list.map(getRef);
					options.dict = options.dict && mapValues(options.dict, getRef);
				}
				return refs[options.uid];
			}
			Object.assign(schema, options);
			if (typeof schema.callback === "string") try {
				schema.callback = new Function("return " + schema.callback)();
			} catch {}
			Object.defineProperty(schema, "uid", { value: globalThis.__schemastery_index__++ });
			Object.setPrototypeOf(schema, Schema.prototype);
			schema.meta ||= {};
			schema.toString = schema.toString.bind(schema);
			return schema;
		};
		Schema.prototype = Object.create(Function.prototype);
		Schema.prototype[kSchema] = true;
		Object.defineProperty(Schema.prototype, "~standard", { get() {
			return {
				version: 1,
				vendor: "schemastery",
				validate: (value) => {
					try {
						return { value: Schema.resolve(value, this, {})[0] };
					} catch (error) {
						if (ValidationError.is(error)) return { issues: [{
							message: error.message,
							path: error.options.path
						}] };
						throw error;
					}
				}
			};
		} });
		Schema.ValidationError = ValidationError;
		Schema.prototype.toJSON = function toJSON() {
			if (globalThis.__schemastery_refs__) {
				globalThis.__schemastery_refs__[this.uid] ??= JSON.parse(JSON.stringify({ ...this }));
				return this.uid;
			}
			globalThis.__schemastery_refs__ = { [this.uid]: { ...this } };
			globalThis.__schemastery_refs__[this.uid] = JSON.parse(JSON.stringify({ ...this }));
			const result = {
				uid: this.uid,
				refs: globalThis.__schemastery_refs__
			};
			globalThis.__schemastery_refs__ = void 0;
			return result;
		};
		Schema.prototype.set = function set(key, value) {
			this.dict[key] = value;
			return this;
		};
		Schema.prototype.push = function push(value) {
			this.list.push(value);
			return this;
		};
		function mergeDesc(original, messages) {
			const result = typeof original === "string" ? { "": original } : { ...original };
			for (const locale in messages) {
				const value = messages[locale];
				if (value?.$description || value?.$desc) result[locale] = value.$description || value.$desc;
				else if (typeof value === "string") result[locale] = value;
			}
			return result;
		}
		function getInner(value) {
			return value?.$value ?? value?.$inner;
		}
		function extractKeys(data) {
			return filterKeys(data ?? {}, (key) => !key.startsWith("$"));
		}
		Schema.prototype.i18n = function i18n(messages) {
			const schema = Schema(this);
			const desc = mergeDesc(schema.meta.description, messages);
			if (Object.keys(desc).length) schema.meta.description = desc;
			if (schema.dict) schema.dict = mapValues(schema.dict, (inner, key) => {
				return inner.i18n(mapValues(messages, (data) => getInner(data)?.[key] ?? data?.[key]));
			});
			if (schema.list) schema.list = schema.list.map((inner, index) => {
				return inner.i18n(mapValues(messages, (data = {}) => {
					if (Array.isArray(getInner(data))) return getInner(data)[index];
					if (Array.isArray(data)) return data[index];
					return extractKeys(data);
				}));
			});
			if (schema.inner) schema.inner = schema.inner.i18n(mapValues(messages, (data) => {
				if (getInner(data)) return getInner(data);
				return extractKeys(data);
			}));
			if (schema.sKey) schema.sKey = schema.sKey.i18n(mapValues(messages, (data) => data?.$key));
			return schema;
		};
		Schema.prototype.extra = function extra(key, value) {
			const schema = Schema(this);
			schema.meta = {
				...schema.meta,
				[key]: value
			};
			return schema;
		};
		for (const key of [
			"required",
			"disabled",
			"collapse",
			"hidden",
			"loose"
		]) Object.assign(Schema.prototype, { [key](value = true) {
			const schema = Schema(this);
			schema.meta = {
				...schema.meta,
				[key]: value
			};
			return schema;
		} });
		Schema.prototype.deprecated = function deprecated() {
			const schema = Schema(this);
			schema.meta.badges ||= [];
			schema.meta.badges.push({
				text: "deprecated",
				type: "danger"
			});
			return schema;
		};
		Schema.prototype.experimental = function experimental() {
			const schema = Schema(this);
			schema.meta.badges ||= [];
			schema.meta.badges.push({
				text: "experimental",
				type: "warning"
			});
			return schema;
		};
		Schema.prototype.pattern = function pattern(regexp) {
			const schema = Schema(this);
			const pattern = pick(regexp, ["source", "flags"]);
			schema.meta = {
				...schema.meta,
				pattern
			};
			return schema;
		};
		Schema.prototype.simplify = function simplify(value) {
			if (isVolatile(value)) value = value.get();
			if (deepEqual(value, this.meta.default, this.type === "dict")) return null;
			if (isNullable(value)) return value;
			if (this.type === "object" || this.type === "dict") {
				const result = {};
				for (const key in value) {
					const item = (this.type === "object" ? this.dict[key] : this.inner)?.simplify(value[key]);
					if (this.type === "dict" || !isNullable(item)) result[key] = item;
				}
				if (deepEqual(result, this.meta.default, this.type === "dict")) return null;
				return result;
			} else if (this.type === "array" || this.type === "tuple") {
				const result = [];
				value.forEach((value, index) => {
					const schema = this.type === "array" ? this.inner : this.list[index];
					const item = schema ? schema.simplify(value) : value;
					result.push(item);
				});
				return result;
			} else if (this.type === "intersect") {
				const result = {};
				for (const item of this.list) Object.assign(result, item.simplify(value));
				return result;
			} else if (this.type === "union") for (const schema of this.list) try {
				Schema.resolve(value, schema, {});
				return schema.simplify(value);
			} catch {}
			return value;
		};
		Schema.prototype.toString = function toString(inline) {
			return formatters[this.type]?.(this, inline) ?? `Schema<${this.type}>`;
		};
		Schema.prototype.role = function role(role, extra) {
			const schema = Schema(this);
			schema.meta = {
				...schema.meta,
				role,
				extra
			};
			return schema;
		};
		for (const key of [
			"default",
			"link",
			"comment",
			"description",
			"max",
			"min",
			"step"
		]) Object.assign(Schema.prototype, { [key](value) {
			const schema = Schema(this);
			schema.meta = {
				...schema.meta,
				[key]: value
			};
			return schema;
		} });
		Schema.prototype.volatile = function volatile() {
			if (this.meta.volatile) throw new TypeError("volatile schema is already wrapped");
			return this.extra("volatile", true);
		};
		const resolvers = {};
		const checkedVolatile = Symbol("checked-volatile-schema");
		function validateVolatileSchema(schema, path = [], blocked = false, seen = /* @__PURE__ */ new Map()) {
			const states = seen.get(schema) ?? /* @__PURE__ */ new Set();
			if (states.has(blocked)) return;
			states.add(blocked);
			seen.set(schema, states);
			if (schema.meta?.volatile && blocked) throw new ValidationError("volatile fields require a fixed object path without an enclosing volatile field", { path });
			const nested = blocked || !!schema.meta?.volatile;
			if (schema.dict) for (const [key, child] of Object.entries(schema.dict)) validateVolatileSchema(child, [...path, key], nested, seen);
			if (schema.sKey) validateVolatileSchema(schema.sKey, [...path, "<key>"], true, seen);
			if (schema.inner && (schema.type !== "lazy" || schema.inner[kSchema])) validateVolatileSchema(schema.inner, [...path, "*"], true, seen);
			if (schema.list) for (let index = 0; index < schema.list.length; index++) validateVolatileSchema(schema.list[index], [...path, String(index)], true, seen);
		}
		Schema.extend = function extend(type, resolve) {
			resolvers[type] = resolve;
		};
		Schema.resolve = function resolve(data, schema, options = {}, strict = false) {
			if (!schema) return [data];
			if (!options[checkedVolatile]) {
				validateVolatileSchema(schema, options.path);
				options = {
					...options,
					[checkedVolatile]: true
				};
			}
			if (schema.meta?.volatile) {
				const inner = Schema(schema);
				inner.meta = {
					...schema.meta,
					volatile: false
				};
				const [value, adapted] = Schema.resolve(data, inner, options, strict);
				try {
					return [createVolatile(value), adapted];
				} catch (error) {
					throw new ValidationError(error instanceof Error ? error.message : String(error), options);
				}
			}
			if (options.ignore?.(data, schema)) return [data];
			if (isNullable(data) && schema.type !== "lazy") {
				if (schema.meta.required) throw new ValidationError(`missing required value`, options);
				let current = schema;
				let fallback = schema.meta.default;
				while (current?.type === "intersect" && isNullable(fallback)) {
					current = current.list[0];
					fallback = current?.meta.default;
				}
				if (isNullable(fallback)) return [data];
				data = clone(fallback);
			}
			const callback = resolvers[schema.type];
			if (!callback) throw new ValidationError(`unsupported type "${schema.type}"`, options);
			try {
				return callback(data, schema, options, strict);
			} catch (error) {
				if (!schema.meta.loose) throw error;
				return [schema.meta.default];
			}
		};
		Schema.from = function from(source) {
			if (isNullable(source)) return Schema.any();
			else if ([
				"string",
				"number",
				"boolean"
			].includes(typeof source)) return Schema.const(source).required();
			else if (source[kSchema]) return source;
			else if (typeof source === "function") switch (source) {
				case String: return Schema.string().required();
				case Number: return Schema.number().required();
				case Boolean: return Schema.boolean().required();
				case Function: return Schema.function().required();
				default: return Schema.is(source).required();
			}
			else throw new TypeError(`cannot infer schema from ${source}`);
		};
		Schema.lazy = function lazy(builder) {
			const toJSON = () => {
				if (!schema.inner[kSchema]) {
					schema.inner = schema.builder();
					schema.inner.meta = {
						...schema.meta,
						...schema.inner.meta
					};
				}
				return schema.inner.toJSON();
			};
			const schema = new Schema({
				type: "lazy",
				builder,
				inner: { toJSON }
			});
			return schema;
		};
		Schema.natural = function natural() {
			return Schema.number().step(1).min(0);
		};
		Schema.percent = function percent() {
			return Schema.number().step(.01).min(0).max(1).role("slider");
		};
		Schema.date = function date() {
			return Schema.union([Schema.is(Date), Schema.transform(Schema.string().role("datetime"), (value, options) => {
				const date = new Date(value);
				if (isNaN(+date)) throw new ValidationError(`invalid date "${value}"`, options);
				return date;
			}, true)]);
		};
		Schema.regExp = function regExp(flag = "") {
			return Schema.union([Schema.is(RegExp), Schema.transform(Schema.string().role("regexp", { flag }), (value, options) => {
				try {
					return new RegExp(value, flag);
				} catch (e) {
					throw new ValidationError(e.message, options);
				}
			}, true)]);
		};
		Schema.arrayBuffer = function arrayBuffer(encoding) {
			return Schema.union([
				Schema.is(ArrayBuffer),
				Schema.is(SharedArrayBuffer),
				Schema.transform(Schema.any(), (value, options) => {
					if (Binary.isSource(value)) return Binary.fromSource(value);
					throw new ValidationError(`expected ArrayBufferSource but got ${value}`, options);
				}, true),
				...encoding ? [Schema.transform(Schema.string(), (value, options) => {
					try {
						return encoding === "base64" ? Binary.fromBase64(value) : Binary.fromHex(value);
					} catch (e) {
						throw new ValidationError(e.message, options);
					}
				}, true)] : []
			]);
		};
		Schema.extend("lazy", (data, schema, options, strict) => {
			if (!schema.inner[kSchema]) {
				schema.inner = schema.builder();
				schema.inner.meta = {
					...schema.meta,
					...schema.inner.meta
				};
				validateVolatileSchema(schema.inner, options.path, true);
			}
			return Schema.resolve(data, schema.inner, options, strict);
		});
		Schema.extend("any", (data) => {
			return [data];
		});
		Schema.extend("never", (data, _, options) => {
			throw new ValidationError(`expected nullable but got ${data}`, options);
		});
		Schema.extend("const", (data, { value }, options) => {
			if (deepEqual(data, value)) return [value];
			throw new ValidationError(`expected ${value} but got ${data}`, options);
		});
		function checkWithinRange(data, meta, description, options, skipMin = false) {
			const { max = Infinity, min = -Infinity } = meta;
			if (data > max) throw new ValidationError(`expected ${description} <= ${max} but got ${data}`, options);
			if (data < min && !skipMin) throw new ValidationError(`expected ${description} >= ${min} but got ${data}`, options);
		}
		Schema.extend("string", (data, { meta }, options) => {
			if (typeof data !== "string") throw new ValidationError(`expected string but got ${data}`, options);
			if (meta.pattern) {
				const regexp = new RegExp(meta.pattern.source, meta.pattern.flags);
				if (!regexp.test(data)) throw new ValidationError(`expect string to match regexp ${regexp}`, options);
			}
			checkWithinRange(data.length, meta, "string length", options);
			return [data];
		});
		function decimalShift(data, digits) {
			const str = data.toString();
			if (str.includes("e")) return data * Math.pow(10, digits);
			const index = str.indexOf(".");
			if (index === -1) return data * Math.pow(10, digits);
			const frac = str.slice(index + 1);
			const integer = str.slice(0, index);
			if (frac.length <= digits) return +(integer + frac.padEnd(digits, "0"));
			return +(integer + frac.slice(0, digits) + "." + frac.slice(digits));
		}
		function isMultipleOf(data, min, step) {
			step = Math.abs(step);
			if (!/^\d+\.\d+$/.test(step.toString())) return (data - min) % step === 0;
			const index = step.toString().indexOf(".");
			const digits = step.toString().slice(index + 1).length;
			return Math.abs(decimalShift(data, digits) - decimalShift(min, digits)) % decimalShift(step, digits) === 0;
		}
		Schema.extend("number", (data, { meta }, options) => {
			if (typeof data !== "number") throw new ValidationError(`expected number but got ${data}`, options);
			checkWithinRange(data, meta, "number", options);
			const { step } = meta;
			if (step && !isMultipleOf(data, meta.min ?? 0, step)) throw new ValidationError(`expected number multiple of ${step} but got ${data}`, options);
			return [data];
		});
		Schema.extend("boolean", (data, _, options) => {
			if (typeof data === "boolean") return [data];
			throw new ValidationError(`expected boolean but got ${data}`, options);
		});
		Schema.extend("bitset", (data, { bits, meta }, options) => {
			let value = 0, keys = [];
			if (typeof data === "number") {
				value = data;
				for (const key in bits) if (data & bits[key]) keys.push(key);
			} else if (Array.isArray(data)) {
				keys = data;
				for (const key of keys) {
					if (typeof key !== "string") throw new ValidationError(`expected string but got ${key}`, options);
					if (key in bits) value |= bits[key];
				}
			} else throw new ValidationError(`expected number or array but got ${data}`, options);
			if (value === meta.default) return [value];
			return [value, keys];
		});
		Schema.extend("function", (data, _, options) => {
			if (typeof data === "function") return [data];
			throw new ValidationError(`expected function but got ${data}`, options);
		});
		Schema.extend("is", (data, { constructor }, options) => {
			if (typeof constructor === "function") {
				if (data instanceof constructor) return [data];
				throw new ValidationError(`expected ${constructor.name} but got ${data}`, options);
			} else {
				if (isNullable(data)) throw new ValidationError(`expected ${constructor} but got ${data}`, options);
				let prototype = Object.getPrototypeOf(data);
				while (prototype) {
					if (prototype.constructor?.name === constructor) return [data];
					prototype = Object.getPrototypeOf(prototype);
				}
				throw new ValidationError(`expected ${constructor} but got ${data}`, options);
			}
		});
		function property(data, key, schema, options) {
			try {
				const [value, adapted] = Schema.resolve(data[key], schema, {
					...options,
					path: [...options.path || [], key]
				});
				if (adapted !== void 0) data[key] = adapted;
				return value;
			} catch (e) {
				if (!options?.autofix) throw e;
				delete data[key];
				return schema.meta.volatile ? createVolatile(schema.meta.default) : schema.meta.default;
			}
		}
		Schema.extend("array", (data, { inner, meta }, options) => {
			if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
			checkWithinRange(data.length, meta, "array length", options, !isNullable(inner.meta.default));
			return [data.map((_, index) => property(data, index, inner, options))];
		});
		Schema.extend("dict", (data, { inner, sKey }, options, strict) => {
			if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
			const result = {};
			for (const key in data) {
				let rKey;
				try {
					rKey = Schema.resolve(key, sKey, options)[0];
				} catch (error) {
					if (strict) continue;
					throw error;
				}
				result[rKey] = property(data, key, inner, options);
				data[rKey] = data[key];
				if (key !== rKey) delete data[key];
			}
			return [result];
		});
		Schema.extend("tuple", (data, { list }, options, strict) => {
			if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
			const result = list.map((inner, index) => property(data, index, inner, options));
			if (strict) return [result];
			result.push(...data.slice(list.length));
			return [result];
		});
		function merge(result, data) {
			for (const key in data) {
				if (key in result) continue;
				result[key] = data[key];
			}
		}
		Schema.extend("object", (data, { dict }, options, strict) => {
			if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
			const result = {};
			for (const key in dict) {
				const value = property(data, key, dict[key], options);
				if (!isNullable(value) || key in data) result[key] = value;
			}
			if (!strict) merge(result, data);
			return [result];
		});
		Schema.extend("union", (data, { list, toString }, options, strict) => {
			const messages = [];
			for (const inner of list) try {
				return Schema.resolve(data, inner, options, strict);
			} catch (error) {
				messages.push(error);
			}
			throw new ValidationError(`expected ${toString()} but got ${JSON.stringify(data)}`, options);
		});
		Schema.extend("intersect", (data, { list, toString }, options, strict) => {
			if (!list.length) return [data];
			let result;
			for (const inner of list) {
				const value = Schema.resolve(data, inner, options, true)[0];
				if (isNullable(value)) continue;
				if (isNullable(result)) result = value;
				else if (typeof result !== typeof value) throw new ValidationError(`expected ${toString()} but got ${JSON.stringify(data)}`, options);
				else if (typeof value === "object") merge(result ??= {}, value);
				else if (result !== value) throw new ValidationError(`expected ${toString()} but got ${JSON.stringify(data)}`, options);
			}
			if (!strict && isPlainObject(data)) merge(result, data);
			return [result];
		});
		Schema.extend("transform", (data, { inner, callback, preserve }, options) => {
			const [result, adapted = data] = Schema.resolve(data, inner, options, true);
			if (preserve) return [callback(result)];
			else return [callback(result), callback(adapted)];
		});
		const formatters = {};
		function defineMethod(name, keys, format) {
			formatters[name] = format;
			Object.assign(Schema, { [name](...args) {
				const schema = new Schema({ type: name });
				keys.forEach((key, index) => {
					switch (key) {
						case "sKey":
							schema.sKey = args[index] ?? Schema.string();
							break;
						case "inner":
							schema.inner = Schema.from(args[index]);
							break;
						case "list":
							schema.list = args[index].map(Schema.from);
							break;
						case "dict":
							schema.dict = mapValues(args[index], Schema.from);
							break;
						case "bits":
							schema.bits = {};
							for (const key in args[index]) {
								if (typeof args[index][key] !== "number") continue;
								schema.bits[key] = args[index][key];
							}
							break;
						case "callback": {
							const callback = schema.callback = args[index];
							callback["toJSON"] ||= () => callback.toString();
							break;
						}
						case "constructor": {
							const constructor = schema.constructor = args[index];
							if (typeof constructor === "function") constructor["toJSON"] ||= () => constructor["name"];
							break;
						}
						default: schema[key] = args[index];
					}
				});
				if (name === "object" || name === "dict") schema.meta.default = {};
				else if (name === "array" || name === "tuple") schema.meta.default = [];
				else if (name === "bitset") schema.meta.default = 0;
				return schema;
			} });
		}
		defineMethod("is", ["constructor"], ({ constructor }) => {
			if (typeof constructor === "function") return constructor.name;
			else return constructor;
		});
		defineMethod("any", [], () => "any");
		defineMethod("never", [], () => "never");
		defineMethod("const", ["value"], ({ value }) => typeof value === "string" ? JSON.stringify(value) : value);
		defineMethod("string", [], () => "string");
		defineMethod("number", [], () => "number");
		defineMethod("boolean", [], () => "boolean");
		defineMethod("bitset", ["bits"], () => "bitset");
		defineMethod("function", [], () => "function");
		defineMethod("array", ["inner"], ({ inner }) => `${inner.toString(true)}[]`);
		defineMethod("dict", ["inner", "sKey"], ({ inner, sKey }) => `{ [key: ${sKey.toString()}]: ${inner.toString()} }`);
		defineMethod("tuple", ["list"], ({ list }) => `[${list.map((inner) => inner.toString()).join(", ")}]`);
		defineMethod("object", ["dict"], ({ dict }) => {
			if (Object.keys(dict).length === 0) return "{}";
			return `{ ${Object.entries(dict).map(([key, inner]) => {
				return `${key}${inner.meta.required ? "" : "?"}: ${inner.toString()}`;
			}).join(", ")} }`;
		});
		defineMethod("union", ["list"], ({ list }, inline) => {
			const result = list.map(({ toString: format }) => format()).join(" | ");
			return inline ? `(${result})` : result;
		});
		defineMethod("intersect", ["list"], ({ list }) => {
			return `${list.map((inner) => inner.toString(true)).join(" & ")}`;
		});
		defineMethod("transform", [
			"inner",
			"callback",
			"preserve"
		], ({ inner }, isInner) => inner.toString(isInner));
		//#endregion
		//#region src/settings/pretty-settings.ts
		const PRETTY_SETTINGS_NAMESPACE = "ui-pretty";
		const HEX_COLOR_PATTERN = /^#[0-9A-F]{6}$/;
		const CODEX_THEME_PRESET_IDS = [
			"ayu",
			"catppuccin",
			"absolutely",
			"codex",
			"dracula",
			"everforest",
			"github",
			"gruvbox",
			"linear",
			"lobster",
			"material",
			"matrix",
			"monokai",
			"night-owl",
			"nord",
			"notion",
			"oscurange",
			"one",
			"proof",
			"raycast",
			"rose-pine",
			"sentry",
			"solarized",
			"tokyo-night",
			"temple",
			"vercel",
			"vscode-plus",
			"xcode"
		];
		const LEGACY_PRETTY_PRESET_IDS = ["ocean", "forest"];
		const PRETTY_PRESET_IDS = [
			...CODEX_THEME_PRESET_IDS,
			...LEGACY_PRETTY_PRESET_IDS,
			"custom"
		];
		const LOCAL_FONT_PREFIX = "local:";
		const LOCAL_FONT_FAMILY_PATTERN = /^[^\u0000-\u001F\u007F"\\]{1,128}$/;
		const UI_FONT_PATTERN = /^(?:system|modern|humanist|local:[^\u0000-\u001F\u007F"\\]{1,128})$/;
		const CODE_FONT_PATTERN = /^(?:system-mono|jetbrains|fira|local:[^\u0000-\u001F\u007F"\\]{1,128})$/;
		const codexLight = {
			accent: "#0169CC",
			background: "#FFFFFF",
			foreground: "#0D0D0D",
			sidebar: "#FCFCFC"
		};
		const codexDark = {
			accent: "#0169CC",
			background: "#111111",
			foreground: "#FCFCFC",
			sidebar: "#131313"
		};
		const DEFAULT_PRETTY_THEME = Object.freeze({
			enabled: false,
			preset: "codex",
			light: Object.freeze(codexLight),
			dark: Object.freeze(codexDark),
			uiFont: "system",
			codeFont: "system-mono",
			translucentSidebar: false,
			contrast: 60
		});
		const colorSchema = Schema.string().pattern(HEX_COLOR_PATTERN);
		const paletteSchema = Schema.object({
			accent: colorSchema.default(codexLight.accent),
			background: colorSchema.default(codexLight.background),
			foreground: colorSchema.default(codexLight.foreground),
			sidebar: colorSchema.default(codexLight.sidebar)
		});
		const darkPaletteSchema = Schema.object({
			accent: colorSchema.default(codexDark.accent),
			background: colorSchema.default(codexDark.background),
			foreground: colorSchema.default(codexDark.foreground),
			sidebar: colorSchema.default(codexDark.sidebar)
		});
		Schema.object({ theme: Schema.object({
			enabled: Schema.boolean().default(false),
			preset: Schema.union([...PRETTY_PRESET_IDS]).default("codex"),
			light: paletteSchema.default(codexLight),
			dark: darkPaletteSchema.default(codexDark),
			uiFont: Schema.string().pattern(UI_FONT_PATTERN).default("system"),
			codeFont: Schema.string().pattern(CODE_FONT_PATTERN).default("system-mono"),
			translucentSidebar: Schema.boolean().default(false),
			contrast: Schema.number().min(0).max(100).step(1).default(60)
		}).default(DEFAULT_PRETTY_THEME).volatile() });
		function clonePrettyTheme(theme) {
			return {
				...theme,
				light: { ...theme.light },
				dark: { ...theme.dark }
			};
		}
		function toLocalFontId(family) {
			const normalized = family.trim();
			if (!isLocalFontFamily(normalized)) throw new TypeError(`invalid local font family: ${family}`);
			return `${LOCAL_FONT_PREFIX}${normalized}`;
		}
		function localFontFamily(id) {
			if (!id.startsWith("local:")) return void 0;
			const family = id.slice(6);
			return isLocalFontFamily(family) ? family : void 0;
		}
		function isLocalFontFamily(family) {
			return family.length <= 128 && LOCAL_FONT_FAMILY_PATTERN.test(family);
		}
		//#endregion
		//#region src/client/locales.ts
		const en = {
			nav: "Pretty",
			title: "Pretty",
			description: "Personalize colors, typography, and interface depth without changing your appearance mode.",
			enabled: "Enable Pretty theme",
			enabledHint: "Applies this palette across DeepSeek Harness.",
			disabledHint: "Your draft is kept, but DSH stays unchanged until Pretty is enabled.",
			disabledTitle: "Pretty is currently off",
			disabledBody: "Enable Pretty before editing. The saved palette will preview across DSH immediately.",
			enableNow: "Enable and preview",
			light: "Light",
			dark: "Dark",
			preview: "Theme preview",
			previewSidebar: "Sidebar",
			previewConversation: "Conversation",
			preset: "Preset",
			ocean: "Ocean",
			forest: "Forest",
			lobster: "Lobster",
			custom: "Custom",
			legacy: "legacy",
			palette: "Palette",
			accent: "Accent",
			background: "Background",
			foreground: "Foreground",
			sidebar: "Sidebar",
			colorError: "Enter a six-digit hexadecimal color, for example #2563EB.",
			typography: "Typography",
			uiFont: "Interface font",
			codeFont: "Code font",
			uiSystem: "System",
			uiModern: "Modern Sans",
			uiHumanist: "Humanist Sans",
			codeSystem: "System Mono",
			codeJetbrains: "JetBrains-first",
			codeFira: "Fira-first",
			builtinFonts: "Built-in stacks",
			systemFonts: "System Font Book",
			fontBookIdle: "Load the complete font family list from this device.",
			loadFonts: "Load system fonts",
			refreshFonts: "Refresh fonts",
			loadingFonts: "Reading Font Book…",
			fontsLoaded: "{count} system font families available.",
			fontsDenied: "Font access was not allowed. You can retry after changing browser permission.",
			fontsUnsupported: "This browser does not support Local Font Access. Built-in stacks remain available.",
			fontsError: "System fonts could not be read. Built-in stacks remain available.",
			effects: "Interface effects",
			translucentSidebar: "Translucent sidebar",
			translucentHint: "Uses an 82% alpha sidebar surface.",
			contrast: "Interface layer strength",
			contrastHint: "Changes surfaces, borders, secondary text, and hover states.",
			reset: "Restore defaults",
			discard: "Discard changes",
			save: "Save and apply",
			saveDisabled: "Save with Pretty off",
			saving: "Saving…",
			saved: "Saved and applied.",
			savedDisabled: "Saved. Pretty remains off.",
			resetDone: "Pretty overrides removed. DSH defaults restored.",
			saveError: "Could not save the settings file. Your draft is still here.",
			conflictTitle: "Settings changed elsewhere",
			conflictBody: "Your draft was preserved. Load the latest settings before editing or saving again.",
			reload: "Load latest settings",
			readonlyTitle: "Pretty is read-only in this browser",
			readonlyRemote: "Remote browser sessions use memory settings. Open DSH from a loopback address to save this page.",
			readonlyUnavailable: "The Host settings provider is unavailable. Add the file settings provider and restart DSH.",
			loading: "Loading Pretty settings",
			contrastCorrected: "Foreground was adjusted to {color} to preserve WCAG 4.5:1 contrast in the {mode} palette.",
			unsaved: "Unsaved changes",
			noChanges: "No unsaved changes"
		};
		const zh = {
			nav: "Pretty",
			title: "Pretty",
			description: "个性化配色、字体与界面层次，不改变 General 中的外观模式。",
			enabled: "启用 Pretty 主题",
			enabledHint: "将此配色应用到整个 DeepSeek Harness。",
			disabledHint: "草稿会保留，但启用 Pretty 前不会改变 DSH。",
			disabledTitle: "Pretty 当前已关闭",
			disabledBody: "请先启用 Pretty 再编辑，已保存的配色会立即在 DSH 中预览。",
			enableNow: "启用并预览",
			light: "浅色",
			dark: "深色",
			preview: "主题预览",
			previewSidebar: "侧栏",
			previewConversation: "对话区",
			preset: "预设",
			ocean: "海洋",
			forest: "森林",
			lobster: "龙虾",
			custom: "自定义",
			legacy: "旧版",
			palette: "配色",
			accent: "强调色",
			background: "背景色",
			foreground: "前景色",
			sidebar: "侧栏色",
			colorError: "请输入六位十六进制颜色，例如 #2563EB。",
			typography: "字体",
			uiFont: "界面字体",
			codeFont: "代码字体",
			uiSystem: "系统默认",
			uiModern: "现代无衬线",
			uiHumanist: "人文无衬线",
			codeSystem: "系统等宽",
			codeJetbrains: "JetBrains 优先",
			codeFira: "Fira 优先",
			builtinFonts: "内置字体栈",
			systemFonts: "系统字体册",
			fontBookIdle: "从这台设备载入完整字体 family 清单。",
			loadFonts: "载入系统字体",
			refreshFonts: "刷新字体列表",
			loadingFonts: "正在读取字体册…",
			fontsLoaded: "已载入 {count} 个系统字体 family。",
			fontsDenied: "未获得字体访问权限，可在修改浏览器权限后重试。",
			fontsUnsupported: "当前浏览器不支持 Local Font Access，仍可使用内置字体栈。",
			fontsError: "无法读取系统字体，仍可使用内置字体栈。",
			effects: "界面效果",
			translucentSidebar: "半透明侧栏",
			translucentHint: "侧栏表面使用 82% 不透明度。",
			contrast: "界面层次强度",
			contrastHint: "影响表面、边框、次级文字与悬停层次。",
			reset: "恢复默认",
			discard: "放弃更改",
			save: "保存并应用",
			saveDisabled: "保存关闭状态",
			saving: "正在保存…",
			saved: "已保存并应用。",
			savedDisabled: "已保存，Pretty 仍保持关闭。",
			resetDone: "已移除 Pretty 覆盖，恢复 DSH 默认主题。",
			saveError: "无法写入设置文件，当前草稿仍然保留。",
			conflictTitle: "设置已在其他位置更改",
			conflictBody: "当前草稿已保留，请先载入最新设置再继续编辑或保存。",
			reload: "载入最新设置",
			readonlyTitle: "当前浏览器中的 Pretty 仅可查看",
			readonlyRemote: "远程浏览器使用内存设置。请通过 loopback 地址打开 DSH 后保存。",
			readonlyUnavailable: "Host 设置 provider 不可用，请添加文件设置 provider 并重启 DSH。",
			loading: "正在加载 Pretty 设置",
			contrastCorrected: "已将{mode}配色的前景色调整为 {color}，以满足 WCAG 4.5:1 对比度。",
			unsaved: "有未保存更改",
			noChanges: "没有未保存更改"
		};
		//#endregion
		//#region src/client/pretty/state/pretty-settings-store.ts
		function createPrettySettingsStore() {
			let snapshot = { status: "loading" };
			const listeners = /* @__PURE__ */ new Set();
			return {
				getSnapshot: () => snapshot,
				subscribe(listener) {
					listeners.add(listener);
					return () => {
						listeners.delete(listener);
					};
				},
				set(next) {
					snapshot = next;
					for (const listener of [...listeners]) listener();
				}
			};
		}
		function isDirty(state) {
			return state.status === "ready" && JSON.stringify(state.persisted) !== JSON.stringify(state.draft);
		}
		//#endregion
		//#region src/client/pretty/state/use-local-font-families.ts
		function useLocalFontFamilies(catalog) {
			const [status, setStatus] = (0, react.useState)(catalog.supported ? "idle" : "unsupported");
			const [families, setFamilies] = (0, react.useState)([]);
			return {
				status,
				families,
				load: (0, react.useCallback)(async () => {
					if (!catalog.supported || status === "loading") return;
					setStatus("loading");
					try {
						setFamilies(await catalog.loadFamilies());
						setStatus("ready");
					} catch (error) {
						setStatus(error instanceof DOMException && error.name === "NotAllowedError" ? "denied" : "error");
					}
				}, [catalog, status])
			};
		}
		//#endregion
		//#region src/client/pretty/theme/theme-presets.ts
		function palette(accent, background, foreground, sidebar) {
			return Object.freeze({
				accent,
				background,
				foreground,
				sidebar
			});
		}
		function preset(id, label, light, dark) {
			return Object.freeze({
				id,
				label,
				light,
				dark
			});
		}
		/** The 28 theme families registered by the installed Codex desktop app. */
		const THEME_PRESETS = Object.freeze({
			ayu: preset("ayu", "Ayu", palette("#F29718", "#FCFCFC", "#5C6166", "#F8F9FA"), palette("#E6B450", "#0B0E14", "#BFBDB6", "#0B0E14")),
			catppuccin: preset("catppuccin", "Catppuccin", palette("#8839EF", "#EFF1F5", "#4C4F69", "#E6E9EF"), palette("#CBA6F7", "#1E1E2E", "#CDD6F4", "#181825")),
			absolutely: preset("absolutely", "Absolutely", palette("#CC7D5E", "#F9F9F7", "#2D2D2B", "#F4F4F2"), palette("#CC7D5E", "#2D2D2B", "#F9F9F7", "#373735")),
			codex: preset("codex", "Codex", palette("#0169CC", "#FFFFFF", "#0D0D0D", "#FCFCFC"), palette("#0169CC", "#111111", "#FCFCFC", "#131313")),
			dracula: preset("dracula", "Dracula", palette("#7C3AED", "#F8F8F2", "#282A36", "#ECECF0"), palette("#FF79C6", "#282A36", "#F8F8F2", "#21222C")),
			everforest: preset("everforest", "Everforest", palette("#93B259", "#FDF6E3", "#5C6A72", "#F4EBD4"), palette("#A7C080", "#2D353B", "#D3C6AA", "#252D32")),
			github: preset("github", "GitHub", palette("#0969DA", "#FFFFFF", "#1F2328", "#F6F8FA"), palette("#1F6FEB", "#0D1117", "#E6EDF3", "#010409")),
			gruvbox: preset("gruvbox", "Gruvbox", palette("#458588", "#FBF1C7", "#3C3836", "#F2E5BC"), palette("#458588", "#282828", "#EBDBB2", "#1D2021")),
			linear: preset("linear", "Linear", palette("#5E6AD2", "#F7F8FA", "#2A3140", "#F2F4F8"), palette("#5E6AD2", "#17181D", "#E6E9EF", "#080A0F")),
			lobster: preset("lobster", "Lobster", palette("#D64F3C", "#FFF8F5", "#2C1916", "#FCEEE9"), palette("#FF5C5C", "#111827", "#E4E4E7", "#171D2B")),
			material: preset("material", "Material", palette("#008577", "#FAFAFA", "#37474F", "#F1F3F4"), palette("#80CBC4", "#212121", "#EEFFFF", "#191919")),
			matrix: preset("matrix", "Matrix", palette("#008A2E", "#F3FFF6", "#083B16", "#E5F8EA"), palette("#1EFF5A", "#040805", "#B8FFCA", "#020402")),
			monokai: preset("monokai", "Monokai", palette("#C93667", "#FAFAF7", "#272822", "#F0F0EB"), palette("#F92672", "#272822", "#F8F8F2", "#1E1F1C")),
			"night-owl": preset("night-owl", "Night Owl", palette("#2AA298", "#FBFBFB", "#403F53", "#F0F0F0"), palette("#82AAFF", "#011627", "#D6DEEB", "#01111F")),
			nord: preset("nord", "Nord", palette("#5E81AC", "#ECEFF4", "#2E3440", "#E5E9F0"), palette("#88C0D0", "#2E3440", "#D8DEE9", "#242933")),
			notion: preset("notion", "Notion", palette("#3183D8", "#FFFFFF", "#37352F", "#F7F6F3"), palette("#3183D8", "#191919", "#D9D9D8", "#151515")),
			oscurange: preset("oscurange", "Oscurange", palette("#D66E22", "#FFF8F2", "#2B1B14", "#F8EBDD"), palette("#F9B98C", "#0B0B0F", "#E6E6E6", "#07070A")),
			one: preset("one", "One", palette("#526FFF", "#FAFAFA", "#383A42", "#EAEAEB"), palette("#4D78CC", "#282C34", "#ABB2BF", "#21252B")),
			proof: preset("proof", "Proof", palette("#3D755D", "#F5F3ED", "#2F312D", "#EFEDE6"), palette("#79B99B", "#1E211D", "#E7E9E3", "#252924")),
			raycast: preset("raycast", "Raycast", palette("#138AF2", "#FFFFFF", "#000000", "#FCFCFC"), palette("#4FA3F8", "#141414", "#FFFFFF", "#101010")),
			"rose-pine": preset("rose-pine", "Rose Pine", palette("#D7827E", "#FAF4ED", "#575279", "#F2E9E1"), palette("#EA9A97", "#232136", "#E0DEF4", "#1F1D2E")),
			sentry: preset("sentry", "Sentry", palette("#6C5CE7", "#FAF9FC", "#2F2938", "#F1EEF6"), palette("#7055F6", "#2D2935", "#E6DFF9", "#26222D")),
			solarized: preset("solarized", "Solarized", palette("#268BD2", "#FDF6E3", "#657B83", "#EEE8D5"), palette("#2AA198", "#002B36", "#839496", "#00212B")),
			"tokyo-night": preset("tokyo-night", "Tokyo Night", palette("#3D59A1", "#F4F5FA", "#343B58", "#E9EBF4"), palette("#7AA2F7", "#1A1B26", "#A9B1D6", "#16161E")),
			temple: preset("temple", "Temple", palette("#607000", "#F7FAEA", "#1B2A20", "#EDF2D7"), palette("#E4F222", "#02120C", "#C7E6DA", "#1D2D0F")),
			vercel: preset("vercel", "Vercel", palette("#006AFF", "#FFFFFF", "#171717", "#FAFAFA"), palette("#006EFE", "#000000", "#EDEDED", "#090909")),
			"vscode-plus": preset("vscode-plus", "VS Code Plus", palette("#007ACC", "#FFFFFF", "#333333", "#F3F3F3"), palette("#007ACC", "#1E1E1E", "#D4D4D4", "#181818")),
			xcode: preset("xcode", "Xcode", palette("#0E0EFF", "#FFFFFF", "#000000", "#F7F7F7"), palette("#5482FF", "#1F1F24", "#FFFFFF", "#19191E"))
		});
		const BUILTIN_PRESET_IDS = CODEX_THEME_PRESET_IDS;
		function applyPreset(theme, id) {
			const selected = THEME_PRESETS[id];
			return {
				...theme,
				preset: id,
				light: { ...selected.light },
				dark: { ...selected.dark }
			};
		}
		//#endregion
		//#region src/client/pretty/theme/font-stacks.ts
		const UI_FONT_STACKS = Object.freeze({
			system: "-apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
			modern: "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
			humanist: "Avenir Next, Avenir, \"Segoe UI\", ui-sans-serif, sans-serif"
		});
		const CODE_FONT_STACKS = Object.freeze({
			"system-mono": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
			jetbrains: "\"JetBrains Mono\", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
			fira: "\"Fira Code\", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
		});
		function quoteFamily(family) {
			return `"${family.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"")}"`;
		}
		function resolveUiFontStack(font) {
			const builtin = UI_FONT_STACKS[font];
			if (builtin !== void 0) return builtin;
			const family = localFontFamily(font);
			if (family !== void 0) return `${quoteFamily(family)}, ${UI_FONT_STACKS.system}`;
			return UI_FONT_STACKS.system;
		}
		function resolveCodeFontStack(font) {
			const builtin = CODE_FONT_STACKS[font];
			if (builtin !== void 0) return builtin;
			const family = localFontFamily(font);
			if (family !== void 0) return `${quoteFamily(family)}, ${CODE_FONT_STACKS["system-mono"]}`;
			return CODE_FONT_STACKS["system-mono"];
		}
		//#endregion
		//#region src/client/pretty/theme/color-contrast.ts
		function parseHex(color) {
			const normalized = color.toUpperCase();
			if (!HEX_COLOR_PATTERN.test(normalized)) throw new TypeError(`invalid color: ${color}`);
			return {
				r: Number.parseInt(normalized.slice(1, 3), 16),
				g: Number.parseInt(normalized.slice(3, 5), 16),
				b: Number.parseInt(normalized.slice(5, 7), 16)
			};
		}
		function toHex({ r, g, b }) {
			const channel = (value) => Math.round(value).toString(16).padStart(2, "0");
			return `#${channel(r)}${channel(g)}${channel(b)}`.toUpperCase();
		}
		function luminanceChannel(value) {
			const channel = value / 255;
			return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
		}
		function luminance(color) {
			const { r, g, b } = parseHex(color);
			return .2126 * luminanceChannel(r) + .7152 * luminanceChannel(g) + .0722 * luminanceChannel(b);
		}
		function normalizeHex(color) {
			const normalized = color.trim().toUpperCase();
			return HEX_COLOR_PATTERN.test(normalized) ? normalized : void 0;
		}
		function contrastRatio(foreground, background) {
			const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
			return (lighter + .05) / (darker + .05);
		}
		function mixColors(from, to, amount) {
			const start = parseHex(from);
			const end = parseHex(to);
			const ratio = Math.min(1, Math.max(0, amount));
			return toHex({
				r: start.r + (end.r - start.r) * ratio,
				g: start.g + (end.g - start.g) * ratio,
				b: start.b + (end.b - start.b) * ratio
			});
		}
		function minimumMix(foreground, background, target, minimum) {
			if (contrastRatio(target, background) < minimum) return void 0;
			let low = 0;
			let high = 1;
			for (let index = 0; index < 24; index += 1) {
				const middle = (low + high) / 2;
				if (contrastRatio(mixColors(foreground, target, middle), background) >= minimum) high = middle;
				else low = middle;
			}
			let candidate = mixColors(foreground, target, high);
			while (contrastRatio(candidate, background) < minimum && high < 1) {
				high = Math.min(1, high + 1 / 255);
				candidate = mixColors(foreground, target, high);
			}
			return {
				color: candidate,
				amount: high
			};
		}
		function ensureReadableForeground(foreground, background, minimum = 4.5) {
			const current = contrastRatio(foreground, background);
			if (current >= minimum) return {
				color: foreground,
				corrected: false,
				ratio: current
			};
			const color = [minimumMix(foreground, background, "#000000", minimum), minimumMix(foreground, background, "#FFFFFF", minimum)].filter((option) => option !== void 0).sort((left, right) => left.amount - right.amount)[0]?.color ?? (contrastRatio("#000000", background) >= contrastRatio("#FFFFFF", background) ? "#000000" : "#FFFFFF");
			return {
				color,
				corrected: color !== foreground,
				ratio: contrastRatio(color, background)
			};
		}
		function readableOnAccent(accent) {
			return contrastRatio("#000000", accent) >= contrastRatio("#FFFFFF", accent) ? "#000000" : "#FFFFFF";
		}
		function withAlpha(color, alpha) {
			const { r, g, b } = parseHex(color);
			const normalized = Math.round(Math.min(1, Math.max(0, alpha)) * 1e3) / 1e3;
			return `rgba(${String(r)}, ${String(g)}, ${String(b)}, ${String(normalized)})`;
		}
		//#endregion
		//#region src/client/pretty/theme/theme-tokens.ts
		const PRETTY_SESSION_ROW_SELECTED_TOKEN = "--dsh-pretty-session-row-selected";
		/** Resolve the colors shared by the live DSH theme and its miniature preview. */
		function derivePreviewColors(palette, theme) {
			const strength = theme.contrast / 100;
			const foreground = ensureReadableForeground(palette.foreground, palette.background).color;
			return {
				background: palette.background,
				foreground,
				accent: palette.accent,
				accentForeground: readableOnAccent(palette.accent),
				sidebar: theme.translucentSidebar ? withAlpha(palette.sidebar, .82) : palette.sidebar,
				sidebarItemHover: withAlpha(foreground, .04 + strength * .08),
				sidebarItemSelected: withAlpha(palette.accent, .08 + strength * .1)
			};
		}
		function modeTokens(palette, theme) {
			const strength = theme.contrast / 100;
			const colors = derivePreviewColors(palette, theme);
			const foreground = colors.foreground;
			const surfaceAmount = .02 + strength * .06;
			const raisedAmount = .035 + strength * .085;
			const surface = mixColors(palette.background, foreground, surfaceAmount);
			const raised = mixColors(palette.background, foreground, raisedAmount);
			const secondarySeed = mixColors(foreground, palette.background, .22 + (1 - strength) * .1);
			const tertiarySeed = mixColors(foreground, palette.background, .34 + (1 - strength) * .08);
			const secondary = ensureReadableForeground(secondarySeed, palette.background).color;
			const tertiary = ensureReadableForeground(tertiarySeed, palette.background).color;
			return {
				"--dsw-alias-bg-base": palette.background,
				"--dsw-alias-bg-layer-1": surface,
				"--dsw-alias-bg-layer-2": raised,
				"--dsw-alias-bg-layer-3": mixColors(palette.background, foreground, raisedAmount + .025),
				"--dsw-alias-bg-overlay": raised,
				"--dsw-alias-bg-module": surface,
				"--dsw-alias-bg-module-platform": surface,
				"--dsw-alias-border-l1": withAlpha(foreground, .04 + strength * .08),
				"--dsw-alias-border-l2": withAlpha(foreground, .06 + strength * .11),
				"--dsw-alias-border-l3": withAlpha(foreground, .08 + strength * .14),
				"--dsw-alias-brand-primary": palette.accent,
				"--dsw-alias-brand-text": palette.accent,
				"--dsw-alias-button-primary-fill": palette.accent,
				"--dsw-alias-button-primary-hover": mixColors(palette.accent, foreground, .1 + strength * .08),
				"--dsw-alias-label-primary": foreground,
				"--dsw-alias-label-secondary": secondary,
				"--dsw-alias-label-tertiary": tertiary,
				"--dsw-alias-label-caption": tertiary,
				"--dsw-alias-label-primary-foreground": readableOnAccent(palette.accent),
				"--dsw-alias-interactive-bg-hover": colors.sidebarItemHover,
				"--dsw-alias-interactive-bg-hover-solid": mixColors(palette.background, foreground, .04 + strength * .08),
				"--dsw-specific-sidebar-fill": colors.sidebar,
				"--dsw-specific-sidebar-nav-item-active": colors.sidebarItemSelected,
				"--dsw-specific-sidebar-nav-item-hover": colors.sidebarItemHover,
				[PRETTY_SESSION_ROW_SELECTED_TOKEN]: colors.sidebarItemSelected,
				"--dsw-font-family": resolveUiFontStack(theme.uiFont),
				"--ds-font-family-code": resolveCodeFontStack(theme.codeFont)
			};
		}
		function deriveThemeTokens(theme) {
			const light = modeTokens(theme.light, theme);
			const dark = modeTokens(theme.dark, theme);
			return Object.fromEntries(Object.keys(light).map((name) => [name, {
				light: light[name],
				dark: dark[name]
			}]));
		}
		//#endregion
		//#region \0pretty-css:src/client/pretty/components/ThemePreview/ThemePreview.module.css.mjs
		const css$8 = ".JcrLUq_preview{min-height:144px;color:var(--pretty-preview-fg);background:var(--pretty-preview-bg);border:1px solid color-mix(in srgb, var(--pretty-preview-fg) 14%, transparent);border-radius:var(--dsw-radius-xl,12px);grid-template-columns:minmax(92px,30%) 1fr;margin:0;display:grid;overflow:hidden}.JcrLUq_sidebar,.JcrLUq_content{flex-direction:column;gap:10px;padding:14px;display:flex}.JcrLUq_sidebar{background:var(--pretty-preview-sidebar);border-right:1px solid color-mix(in srgb, var(--pretty-preview-fg) 10%, transparent)}.JcrLUq_previewLabel{opacity:.72;font-size:11px}.JcrLUq_navItem{opacity:.16;background:currentColor;border-radius:4px;width:72%;height:7px}.JcrLUq_navItemActive{opacity:1;background:var(--pretty-preview-sidebar-item);width:88%;height:20px}.JcrLUq_message,.JcrLUq_messageShort{opacity:.18;background:currentColor;border-radius:4px;height:9px}.JcrLUq_messageShort{width:64%}.JcrLUq_composer{border:1px solid color-mix(in srgb, var(--pretty-preview-fg) 18%, transparent);border-radius:9px;align-items:center;height:36px;margin-top:auto;padding:0 9px;display:flex}.JcrLUq_composer span{opacity:.16;background:currentColor;border-radius:3px;width:60%;height:6px}";
		const tagId$8 = "dsh-pretty-extension/ThemePreview.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$8) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-pretty-extension";
			tag.dataset.pluginCss = tagId$8;
			tag.textContent = css$8;
			document.head.appendChild(tag);
		}
		var ThemePreview_module_css_default = {
			"composer": "JcrLUq_composer",
			"content": "JcrLUq_content",
			"message": "JcrLUq_message",
			"messageShort": "JcrLUq_messageShort",
			"navItem": "JcrLUq_navItem",
			"navItemActive": "JcrLUq_navItemActive",
			"preview": "JcrLUq_preview",
			"previewLabel": "JcrLUq_previewLabel",
			"sidebar": "JcrLUq_sidebar"
		};
		//#endregion
		//#region src/client/pretty/components/ThemePreview/ThemePreview.tsx
		function ThemePreview({ palette, translucentSidebar, contrast, label, sidebarLabel, conversationLabel }) {
			const colors = derivePreviewColors(palette, {
				translucentSidebar,
				contrast
			});
			const previewStyle = {
				"--pretty-preview-bg": colors.background,
				"--pretty-preview-fg": colors.foreground,
				"--pretty-preview-accent": colors.accent,
				"--pretty-preview-accent-fg": colors.accentForeground,
				"--pretty-preview-sidebar": colors.sidebar,
				"--pretty-preview-sidebar-item": colors.sidebarItemSelected
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("figure", {
				className: ThemePreview_module_css_default.preview,
				style: previewStyle,
				"aria-label": label,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: ThemePreview_module_css_default.sidebar,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: ThemePreview_module_css_default.previewLabel,
							children: sidebarLabel
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: ThemePreview_module_css_default.navItem }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: ThemePreview_module_css_default.navItem }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: `${ThemePreview_module_css_default.navItem} ${ThemePreview_module_css_default.navItemActive}` })
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: ThemePreview_module_css_default.content,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: ThemePreview_module_css_default.previewLabel,
							children: conversationLabel
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: ThemePreview_module_css_default.message }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: ThemePreview_module_css_default.messageShort }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: ThemePreview_module_css_default.composer,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {})
						})
					]
				})]
			});
		}
		//#endregion
		//#region \0pretty-css:src/client/pretty/components/ColorField/ColorField.module.css.mjs
		const css$7 = ".pjQbIa_field{border-bottom:1px solid var(--dsw-alias-border-l1);grid-template-columns:minmax(110px,1fr) minmax(148px,188px);align-items:center;gap:8px 16px;padding:10px 0;display:grid}.pjQbIa_label{min-width:0;color:var(--dsw-alias-label-primary);font-size:13px}.pjQbIa_controls{grid-template-columns:34px 1fr;gap:8px;display:grid}.pjQbIa_swatch{cursor:pointer;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md,8px);width:34px;height:30px;padding:3px}.pjQbIa_text{box-sizing:border-box;min-width:0;height:30px;color:var(--dsw-alias-label-primary);font:12px var(--ds-font-family-code,ui-monospace, monospace);text-transform:uppercase;background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md,8px);padding:0 9px}.pjQbIa_text[aria-invalid=true]{border-color:var(--dsw-alias-status-error,#d84a4a)}.pjQbIa_text:focus-visible,.pjQbIa_swatch:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}.pjQbIa_error{color:var(--dsw-alias-status-error,#d84a4a);grid-column:2;font-size:11px;line-height:1.4}@container (width<=420px){.pjQbIa_field{grid-template-columns:1fr}.pjQbIa_error{grid-column:1}}";
		const tagId$7 = "dsh-pretty-extension/ColorField.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$7) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-pretty-extension";
			tag.dataset.pluginCss = tagId$7;
			tag.textContent = css$7;
			document.head.appendChild(tag);
		}
		var ColorField_module_css_default = {
			"controls": "pjQbIa_controls",
			"error": "pjQbIa_error",
			"field": "pjQbIa_field",
			"label": "pjQbIa_label",
			"swatch": "pjQbIa_swatch",
			"text": "pjQbIa_text"
		};
		//#endregion
		//#region src/client/pretty/components/ColorField/ColorField.tsx
		function ColorField({ label, value, errorMessage, disabled, onCommit }) {
			const [text, setText] = (0, react.useState)(value);
			const [invalid, setInvalid] = (0, react.useState)(false);
			const id = (0, react.useId)();
			const errorId = `${id}-error`;
			(0, react.useEffect)(() => {
				setText(value);
				setInvalid(false);
			}, [value]);
			const commit = () => {
				const normalized = normalizeHex(text);
				if (normalized === void 0) {
					setInvalid(true);
					return;
				}
				setInvalid(false);
				setText(normalized);
				onCommit(normalized);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: ColorField_module_css_default.field,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
						className: ColorField_module_css_default.label,
						htmlFor: id,
						children: label
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: ColorField_module_css_default.controls,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							className: ColorField_module_css_default.swatch,
							type: "color",
							"aria-label": `${label} color picker`,
							value,
							disabled,
							onChange: (event) => onCommit(event.currentTarget.value.toUpperCase())
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							id,
							className: ColorField_module_css_default.text,
							value: text,
							disabled,
							spellCheck: false,
							autoComplete: "off",
							"aria-invalid": invalid,
							"aria-describedby": invalid ? errorId : void 0,
							onChange: (event) => {
								setText(event.currentTarget.value);
								setInvalid(false);
							},
							onBlur: commit,
							onKeyDown: (event) => {
								if (event.key === "Enter") {
									event.preventDefault();
									commit();
								}
								if (event.key === "Escape") {
									setText(value);
									setInvalid(false);
								}
							}
						})]
					}),
					invalid && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						id: errorId,
						className: ColorField_module_css_default.error,
						children: errorMessage
					})
				]
			});
		}
		//#endregion
		//#region \0pretty-css:src/client/pretty/components/PaletteEditor/PaletteEditor.module.css.mjs
		const css$6 = ".EdnHOq_editor{border:0;min-width:0;margin:0;padding:0}.EdnHOq_legend{color:var(--dsw-alias-label-primary);padding:0 0 6px;font-size:14px;font-weight:600}";
		const tagId$6 = "dsh-pretty-extension/PaletteEditor.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$6) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-pretty-extension";
			tag.dataset.pluginCss = tagId$6;
			tag.textContent = css$6;
			document.head.appendChild(tag);
		}
		var PaletteEditor_module_css_default = {
			"editor": "EdnHOq_editor",
			"legend": "EdnHOq_legend"
		};
		//#endregion
		//#region src/client/pretty/components/PaletteEditor/PaletteEditor.tsx
		const fields = [
			"accent",
			"background",
			"foreground",
			"sidebar"
		];
		function PaletteEditor({ legend, palette, labels, errorMessage, disabled, onChange }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("fieldset", {
				className: PaletteEditor_module_css_default.editor,
				disabled,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("legend", {
					className: PaletteEditor_module_css_default.legend,
					children: legend
				}), fields.map((field) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ColorField, {
					label: labels[field],
					value: palette[field],
					errorMessage,
					disabled,
					onCommit: (color) => onChange(field, color)
				}, field))]
			});
		}
		//#endregion
		//#region \0pretty-css:src/client/pretty/components/PrettySelect/PrettySelect.module.css.mjs
		const css$5 = ".fNk9tq_root{width:100%;min-width:0}.fNk9tq_trigger{box-sizing:border-box;width:100%;min-width:0;height:36px;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-module-platform);cursor:pointer;font:inherit;text-align:left;border:0;border-radius:18px;justify-content:space-between;align-items:center;gap:12px;padding:0 12px 0 14px;font-size:13px;line-height:20px;display:inline-flex}.fNk9tq_trigger:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover-solid)}.fNk9tq_trigger:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}.fNk9tq_trigger:disabled{color:var(--dsw-alias-label-dimmed,var(--dsw-alias-label-tertiary));cursor:default;opacity:.55}.fNk9tq_value{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}.fNk9tq_chevron{color:var(--dsw-alias-label-caption);flex:none;transition:transform .12s;display:inline-flex}.fNk9tq_chevronOpen{transform:rotate(180deg)}@media (prefers-reduced-motion:reduce){.fNk9tq_chevron{transition:none}}";
		const tagId$5 = "dsh-pretty-extension/PrettySelect.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$5) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-pretty-extension";
			tag.dataset.pluginCss = tagId$5;
			tag.textContent = css$5;
			document.head.appendChild(tag);
		}
		var PrettySelect_module_css_default = {
			"chevron": "fNk9tq_chevron",
			"chevronOpen": "fNk9tq_chevronOpen",
			"root": "fNk9tq_root",
			"trigger": "fNk9tq_trigger",
			"value": "fNk9tq_value"
		};
		//#endregion
		//#region src/client/pretty/components/PrettySelect/PrettySelect.tsx
		/** DSH-menu-backed single-value picker for Pretty settings rows. */
		function PrettySelect({ label, value, groups, disabled = false, onChange }) {
			const [open, setOpen] = (0, react.useState)(false);
			const selectedLabel = groups.flatMap((group) => group.options).find((option) => option.value === value)?.label ?? value;
			const entries = groups.flatMap((group, index) => [...group.label === void 0 ? [] : [{
				type: "label",
				id: `group-${String(index)}`,
				text: group.label
			}], ...group.options.map((option) => ({
				id: option.value,
				label: option.label
			}))]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
				open: open && !disabled,
				onClose: () => {
					setOpen(false);
				},
				items: entries,
				selectedId: value,
				onSelect: (id) => {
					setOpen(false);
					onChange(id);
				},
				align: "end",
				portal: true,
				dense: true,
				className: PrettySelect_module_css_default.root,
				anchor: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: PrettySelect_module_css_default.trigger,
					"aria-label": label,
					"aria-haspopup": "menu",
					"aria-expanded": open && !disabled,
					disabled,
					onClick: () => {
						setOpen((current) => !current);
					},
					onKeyDown: (event) => {
						if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
						event.preventDefault();
						setOpen(true);
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: PrettySelect_module_css_default.value,
						children: selectedLabel
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutlineRegular, { className: `${PrettySelect_module_css_default.chevron} ${open ? PrettySelect_module_css_default.chevronOpen : ""}` })]
				})
			});
		}
		//#endregion
		//#region \0pretty-css:src/client/pretty/components/TypographyControls/TypographyControls.module.css.mjs
		const css$4 = "._2sB6Ua_group{border:0;min-width:0;margin:0;padding:0}._2sB6Ua_legend{color:var(--dsw-alias-label-primary);padding:0 0 6px;font-size:14px;font-weight:600}._2sB6Ua_catalogRow{min-height:36px;color:var(--dsw-alias-label-secondary);border-bottom:1px solid var(--dsw-alias-border-l1);justify-content:space-between;align-items:center;gap:12px;font-size:11px;line-height:18px;display:flex}._2sB6Ua_catalogRow button{min-height:28px;color:var(--dsw-alias-brand-text);border:1px solid var(--dsw-alias-border-l2);cursor:pointer;font:inherit;background:0 0;border-radius:14px;flex:none;padding:0 10px;font-weight:600}._2sB6Ua_catalogRow button:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}._2sB6Ua_catalogRow button:disabled{cursor:default;opacity:.45}._2sB6Ua_catalogRow button:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}._2sB6Ua_row{min-height:44px;color:var(--dsw-alias-label-primary);border-bottom:1px solid var(--dsw-alias-border-l1);grid-template-columns:minmax(110px,1fr) minmax(170px,238px);align-items:center;gap:16px;font-size:13px;display:grid}@container (width<=420px){._2sB6Ua_catalogRow{flex-direction:column;align-items:flex-start;gap:8px;padding:8px 0}._2sB6Ua_row{grid-template-columns:1fr;gap:6px;padding:9px 0}}";
		const tagId$4 = "dsh-pretty-extension/TypographyControls.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$4) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-pretty-extension";
			tag.dataset.pluginCss = tagId$4;
			tag.textContent = css$4;
			document.head.appendChild(tag);
		}
		var TypographyControls_module_css_default = {
			"catalogRow": "_2sB6Ua_catalogRow",
			"group": "_2sB6Ua_group",
			"legend": "_2sB6Ua_legend",
			"row": "_2sB6Ua_row"
		};
		//#endregion
		//#region src/client/pretty/components/TypographyControls/TypographyControls.tsx
		function TypographyControls(props) {
			const selectedFamilies = [localFontFamily(props.uiFont), localFontFamily(props.codeFont)].filter((family) => family !== void 0);
			const families = [.../* @__PURE__ */ new Set([...props.localFamilies, ...selectedFamilies])].sort((left, right) => left.localeCompare(right, void 0, { sensitivity: "base" }));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("fieldset", {
				className: TypographyControls_module_css_default.group,
				disabled: props.disabled,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("legend", {
						className: TypographyControls_module_css_default.legend,
						children: props.title
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: TypographyControls_module_css_default.catalogRow,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							"aria-live": "polite",
							children: props.fontBookStatus
						}), props.canLoadFonts && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: props.loadingFonts,
							onClick: props.onLoadFonts,
							children: props.loadFontsLabel
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: TypographyControls_module_css_default.row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: props.uiLabel }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PrettySelect, {
							label: props.uiLabel,
							value: props.uiFont,
							disabled: props.disabled,
							groups: [{
								label: props.builtinGroupLabel,
								options: props.uiOptions
							}, ...families.length === 0 ? [] : [{
								label: props.localGroupLabel,
								options: families.map((family) => ({
									value: toLocalFontId(family),
									label: family
								}))
							}]],
							onChange: props.onUiFontChange
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: TypographyControls_module_css_default.row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: props.codeLabel }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PrettySelect, {
							label: props.codeLabel,
							value: props.codeFont,
							disabled: props.disabled,
							groups: [{
								label: props.builtinGroupLabel,
								options: props.codeOptions
							}, ...families.length === 0 ? [] : [{
								label: props.localGroupLabel,
								options: families.map((family) => ({
									value: toLocalFontId(family),
									label: family
								}))
							}]],
							onChange: props.onCodeFontChange
						})]
					})
				]
			});
		}
		//#endregion
		//#region \0pretty-css:src/client/pretty/components/EffectsControls/EffectsControls.module.css.mjs
		const css$3 = ".go3HUW_group{border:0;min-width:0;margin:0;padding:0}.go3HUW_legend{color:var(--dsw-alias-label-primary);padding:0 0 6px;font-size:14px;font-weight:600}.go3HUW_row{min-height:52px;color:var(--dsw-alias-label-primary);border-bottom:1px solid var(--dsw-alias-border-l1);grid-template-columns:minmax(150px,1fr) auto;align-items:center;gap:16px;display:grid}.go3HUW_copy{gap:3px;font-size:13px;display:grid}.go3HUW_copy small{color:var(--dsw-alias-label-secondary);font-size:11px;line-height:1.45}.go3HUW_switch{width:34px;height:20px;position:relative}.go3HUW_switch input{z-index:1;opacity:0;cursor:pointer;width:100%;height:100%;margin:0;position:absolute;inset:0}.go3HUW_switch>span{box-sizing:border-box;background:var(--dsw-alias-bg-layer-3);border:1px solid var(--dsw-alias-border-l2);border-radius:999px;width:100%;height:100%;transition:background-color .12s;display:block}.go3HUW_switch>span:after{content:\"\";background:var(--dsw-alias-label-secondary);border-radius:50%;width:14px;height:14px;margin:2px;transition:transform .12s;display:block}.go3HUW_switch input:checked+span{background:var(--dsw-alias-brand-primary);border-color:#0000}.go3HUW_switch input:checked+span:after{background:var(--dsw-alias-label-primary-foreground);transform:translate(14px)}.go3HUW_switch input:focus-visible+span{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}.go3HUW_rangeControl{grid-template-columns:minmax(92px,150px) 24px;align-items:center;gap:10px;display:grid}.go3HUW_rangeControl input{accent-color:var(--dsw-alias-brand-primary)}.go3HUW_rangeControl input:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}.go3HUW_rangeControl output{color:var(--dsw-alias-label-secondary);font:12px var(--ds-font-family-code,ui-monospace, monospace);text-align:right}@container (width<=420px){.go3HUW_rangeRow{grid-template-columns:1fr;gap:8px;padding:10px 0}.go3HUW_rangeControl{grid-template-columns:1fr 24px}}@media (prefers-reduced-motion:reduce){.go3HUW_switch>span,.go3HUW_switch>span:after{transition:none}}";
		const tagId$3 = "dsh-pretty-extension/EffectsControls.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$3) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-pretty-extension";
			tag.dataset.pluginCss = tagId$3;
			tag.textContent = css$3;
			document.head.appendChild(tag);
		}
		var EffectsControls_module_css_default = {
			"copy": "go3HUW_copy",
			"group": "go3HUW_group",
			"legend": "go3HUW_legend",
			"rangeControl": "go3HUW_rangeControl",
			"rangeRow": "go3HUW_rangeRow",
			"row": "go3HUW_row",
			"switch": "go3HUW_switch"
		};
		//#endregion
		//#region src/client/pretty/components/EffectsControls/EffectsControls.tsx
		function EffectsControls(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("fieldset", {
				className: EffectsControls_module_css_default.group,
				disabled: props.disabled,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("legend", {
						className: EffectsControls_module_css_default.legend,
						children: props.title
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: EffectsControls_module_css_default.row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: EffectsControls_module_css_default.copy,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: props.translucentLabel }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: props.translucentHint })]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: EffectsControls_module_css_default.switch,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "checkbox",
								role: "switch",
								checked: props.translucentSidebar,
								onChange: (event) => props.onTranslucentChange(event.currentTarget.checked)
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { "aria-hidden": "true" })]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: `${EffectsControls_module_css_default.row} ${EffectsControls_module_css_default.rangeRow}`,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: EffectsControls_module_css_default.copy,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: props.contrastLabel }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: props.contrastHint })]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: EffectsControls_module_css_default.rangeControl,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "range",
								min: "0",
								max: "100",
								step: "1",
								value: props.contrast,
								"aria-valuetext": `${String(props.contrast)}%`,
								onChange: (event) => props.onContrastChange(Number(event.currentTarget.value))
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("output", { children: props.contrast })]
						})]
					})
				]
			});
		}
		//#endregion
		//#region \0pretty-css:src/client/pretty/components/SettingsActionBar/SettingsActionBar.module.css.mjs
		const css$2 = ".HROkva_bar{z-index:1;background:var(--dsw-alias-bg-layer-2);border-top:1px solid var(--dsw-alias-border-l1);justify-content:space-between;align-items:center;gap:12px;min-height:42px;padding:12px 0 0;display:flex;position:sticky;bottom:0}.HROkva_status{color:var(--dsw-alias-label-secondary);font-size:11px}.HROkva_actions{flex-wrap:wrap;justify-content:flex-end;gap:8px;display:flex}@container (width<=460px){.HROkva_bar{flex-direction:column;align-items:stretch;position:static}.HROkva_actions{grid-template-columns:1fr 1fr;display:grid}.HROkva_actions>:last-child{grid-column:1/-1}}";
		const tagId$2 = "dsh-pretty-extension/SettingsActionBar.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-pretty-extension";
			tag.dataset.pluginCss = tagId$2;
			tag.textContent = css$2;
			document.head.appendChild(tag);
		}
		var SettingsActionBar_module_css_default = {
			"actions": "HROkva_actions",
			"bar": "HROkva_bar",
			"status": "HROkva_status"
		};
		//#endregion
		//#region src/client/pretty/components/SettingsActionBar/SettingsActionBar.tsx
		function SettingsActionBar(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: SettingsActionBar_module_css_default.bar,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: SettingsActionBar_module_css_default.status,
					"aria-live": "polite",
					"aria-atomic": "true",
					children: props.statusLabel
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: SettingsActionBar_module_css_default.actions,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							type: "button",
							variant: "ghost",
							size: "sm",
							disabled: props.saving,
							onClick: props.onReset,
							children: props.resetLabel
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							disabled: !props.dirty || props.saving,
							onClick: props.onDiscard,
							children: props.discardLabel
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							type: "button",
							variant: "primary",
							size: "sm",
							disabled: props.saveDisabled,
							onClick: props.onSave,
							children: props.saveLabel
						})
					]
				})]
			});
		}
		//#endregion
		//#region \0pretty-css:src/client/pretty/PrettySection/PrettySection.module.css.mjs
		const css$1 = "._3JfzhW_section{width:100%;min-width:0;color:var(--dsw-alias-label-primary);flex-direction:column;gap:24px;padding:4px 0 16px;display:flex;container-type:inline-size}._3JfzhW_header{gap:16px;display:grid}._3JfzhW_header h1{margin:0;font-size:20px;line-height:1.25}._3JfzhW_header p{max-width:560px;color:var(--dsw-alias-label-secondary);margin:6px 0 0;font-size:12px;line-height:1.6}._3JfzhW_masterSwitch{background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-lg,10px);grid-template-columns:1fr auto;align-items:center;gap:16px;padding:12px 14px;display:grid}._3JfzhW_masterSwitch>span{gap:3px;display:grid}._3JfzhW_masterSwitch strong{font-size:13px}._3JfzhW_masterSwitch small{color:var(--dsw-alias-label-secondary);font-size:11px;line-height:1.45}._3JfzhW_masterToggle{width:34px;height:20px;position:relative}._3JfzhW_masterToggle input{z-index:1;cursor:pointer;opacity:0;width:100%;height:100%;margin:0;position:absolute;inset:0}._3JfzhW_masterToggle>span{box-sizing:border-box;background:var(--dsw-alias-bg-layer-3);border:1px solid var(--dsw-alias-border-l2);border-radius:999px;width:100%;height:100%;transition:background-color .12s;display:block}._3JfzhW_masterToggle>span:after{content:\"\";background:var(--dsw-alias-label-secondary);border-radius:50%;width:14px;height:14px;margin:2px;transition:transform .12s;display:block}._3JfzhW_masterToggle input:checked+span{background:var(--dsw-alias-brand-primary);border-color:#0000}._3JfzhW_masterToggle input:checked+span:after{background:var(--dsw-alias-label-primary-foreground);transform:translate(14px)}._3JfzhW_masterToggle input:focus-visible+span,._3JfzhW_segmented button:focus-visible,._3JfzhW_notice button:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}._3JfzhW_notice{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-lg,10px);gap:6px;padding:12px 14px;font-size:12px;line-height:1.5;display:grid}._3JfzhW_notice span{color:var(--dsw-alias-label-secondary)}._3JfzhW_notice button{color:var(--dsw-alias-brand-text);cursor:pointer;font:inherit;background:0 0;border:0;justify-self:start;padding:0;font-weight:600}._3JfzhW_previewGroup{gap:12px;display:grid}._3JfzhW_segmented{background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l1);border-radius:var(--dsw-radius-md,8px);grid-template-columns:1fr 1fr;justify-self:start;padding:2px;display:inline-grid}._3JfzhW_segmented button{min-width:72px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:0;border-radius:6px;padding:0 12px}._3JfzhW_segmented button[aria-pressed=true]{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-3)}._3JfzhW_selectRow{color:var(--dsw-alias-label-primary);grid-template-columns:minmax(110px,1fr) minmax(170px,238px);align-items:center;gap:16px;font-size:13px;display:grid}._3JfzhW_liveRegion{clip:rect(0 0 0 0);white-space:nowrap;border:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}._3JfzhW_skeletonTitle,._3JfzhW_skeletonLine,._3JfzhW_skeletonPanel{background:var(--dsw-alias-bg-layer-2);border-radius:var(--dsw-radius-md,8px);animation:1.4s ease-in-out infinite _3JfzhW_pulse;overflow:hidden}._3JfzhW_skeletonTitle{width:96px;height:24px}._3JfzhW_skeletonLine{width:min(100%,420px);height:12px}._3JfzhW_skeletonPanel{width:100%;height:180px}@keyframes _3JfzhW_pulse{50%{opacity:.5}}@container (width<=420px){._3JfzhW_selectRow{grid-template-columns:1fr;gap:6px}}@media (prefers-reduced-motion:reduce){._3JfzhW_skeletonTitle,._3JfzhW_skeletonLine,._3JfzhW_skeletonPanel{animation:none}._3JfzhW_masterToggle>span,._3JfzhW_masterToggle>span:after{transition:none}}";
		const tagId$1 = "dsh-pretty-extension/PrettySection.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-pretty-extension";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var PrettySection_module_css_default = {
			"header": "_3JfzhW_header",
			"liveRegion": "_3JfzhW_liveRegion",
			"masterSwitch": "_3JfzhW_masterSwitch",
			"masterToggle": "_3JfzhW_masterToggle",
			"notice": "_3JfzhW_notice",
			"previewGroup": "_3JfzhW_previewGroup",
			"pulse": "_3JfzhW_pulse",
			"section": "_3JfzhW_section",
			"segmented": "_3JfzhW_segmented",
			"selectRow": "_3JfzhW_selectRow",
			"skeletonLine": "_3JfzhW_skeletonLine",
			"skeletonPanel": "_3JfzhW_skeletonPanel",
			"skeletonTitle": "_3JfzhW_skeletonTitle"
		};
		//#endregion
		//#region src/client/pretty/PrettySection/PrettySection.tsx
		function Loading({ t }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: PrettySection_module_css_default.section,
				"aria-busy": "true",
				"aria-label": t("loading"),
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: PrettySection_module_css_default.skeletonTitle }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: PrettySection_module_css_default.skeletonLine }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: PrettySection_module_css_default.skeletonPanel })
				]
			});
		}
		function ReadonlyState({ t, reason, persisted, mode }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: PrettySection_module_css_default.section,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: PrettySection_module_css_default.header,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h1", { children: t("title") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("description") })]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: PrettySection_module_css_default.notice,
						role: "status",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: t("readonlyTitle") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t(reason === "remote-memory" ? "readonlyRemote" : "readonlyUnavailable") })]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ThemePreview, {
						palette: persisted[mode],
						translucentSidebar: persisted.translucentSidebar,
						contrast: persisted.contrast,
						label: t("preview"),
						sidebarLabel: t("previewSidebar"),
						conversationLabel: t("previewConversation")
					})
				]
			});
		}
		function PrettySection({ controller, fontCatalog, initialMode, usePretty, t }) {
			const state = usePretty((snapshot) => snapshot);
			const [mode, setMode] = (0, react.useState)(initialMode);
			const localFonts = useLocalFontFamilies(fontCatalog);
			(0, react.useEffect)(() => () => {
				controller.discard();
			}, [controller]);
			if (state.status === "loading") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Loading, { t });
			if (state.status === "readonly") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ReadonlyState, {
				t,
				reason: state.reason,
				persisted: state.persisted,
				mode
			});
			const disabled = state.saveStatus === "saving" || state.saveStatus === "conflict";
			const editorDisabled = disabled || !state.draft.enabled;
			const dirty = isDirty(state);
			const palette = state.draft[mode];
			const correction = state.message?.startsWith("contrast:") === true ? state.message.split(":") : void 0;
			const correctionMessage = correction !== void 0 ? t("contrastCorrected", {
				mode: correction[1] === "dark" ? t("dark") : t("light"),
				color: correction[2] ?? ""
			}) : "";
			const resultMessage = state.message === "saved" ? t(state.draft.enabled ? "saved" : "savedDisabled") : state.message === "reset" ? t("resetDone") : state.message === "save-error" ? t("saveError") : "";
			const actionStatus = state.message === "saved" || state.message === "reset" || state.message === "save-error" ? resultMessage : dirty ? t("unsaved") : t("noChanges");
			const fontBookStatus = localFonts.status === "ready" ? t("fontsLoaded", { count: localFonts.families.length }) : t(localFonts.status === "idle" ? "fontBookIdle" : localFonts.status === "loading" ? "loadingFonts" : localFonts.status === "denied" ? "fontsDenied" : localFonts.status === "unsupported" ? "fontsUnsupported" : "fontsError");
			const canLoadFonts = localFonts.status !== "unsupported" && localFonts.status !== "loading";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: PrettySection_module_css_default.section,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: PrettySection_module_css_default.header,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h1", { children: t("title") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("description") })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: PrettySection_module_css_default.masterSwitch,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: t("enabled") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: t(state.draft.enabled ? "enabledHint" : "disabledHint") })] }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: PrettySection_module_css_default.masterToggle,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "checkbox",
									role: "switch",
									checked: state.draft.enabled,
									disabled,
									onChange: (event) => controller.setEnabled(event.currentTarget.checked)
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { "aria-hidden": "true" })]
							})]
						})]
					}),
					state.saveStatus === "conflict" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: PrettySection_module_css_default.notice,
						role: "alert",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: t("conflictTitle") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("conflictBody") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => controller.reloadLatest(),
								children: t("reload")
							})
						]
					}),
					!state.draft.enabled && state.saveStatus !== "conflict" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: PrettySection_module_css_default.notice,
						role: "status",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: t("disabledTitle") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("disabledBody") }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								disabled,
								onClick: () => controller.setEnabled(true),
								children: t("enableNow")
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: PrettySection_module_css_default.previewGroup,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: PrettySection_module_css_default.segmented,
							"aria-label": t("palette"),
							children: ["light", "dark"].map((value) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": mode === value,
								onClick: () => setMode(value),
								children: t(value)
							}, value))
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ThemePreview, {
							palette,
							translucentSidebar: state.draft.translucentSidebar,
							contrast: state.draft.contrast,
							label: `${t("preview")} — ${t(mode)}`,
							sidebarLabel: t("previewSidebar"),
							conversationLabel: t("previewConversation")
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: PrettySection_module_css_default.selectRow,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("preset") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PrettySelect, {
							label: t("preset"),
							value: state.draft.preset,
							disabled: editorDisabled,
							groups: [{ options: [
								...BUILTIN_PRESET_IDS.map((id) => ({
									value: id,
									label: THEME_PRESETS[id].label
								})),
								...state.draft.preset === "custom" ? [{
									value: "custom",
									label: t("custom")
								}] : [],
								...state.draft.preset === "ocean" || state.draft.preset === "forest" ? [{
									value: state.draft.preset,
									label: `${t(state.draft.preset)} (${t("legacy")})`
								}] : []
							] }],
							onChange: (value) => {
								if (value !== "custom") controller.selectPreset(value);
							}
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PaletteEditor, {
						legend: `${t("palette")} — ${t(mode)}`,
						palette,
						labels: {
							accent: t("accent"),
							background: t("background"),
							foreground: t("foreground"),
							sidebar: t("sidebar")
						},
						errorMessage: t("colorError"),
						disabled: editorDisabled,
						onChange: (field, color) => controller.updatePalette(mode, field, color)
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(TypographyControls, {
						title: t("typography"),
						uiLabel: t("uiFont"),
						codeLabel: t("codeFont"),
						uiFont: state.draft.uiFont,
						codeFont: state.draft.codeFont,
						uiOptions: [
							{
								value: "system",
								label: t("uiSystem")
							},
							{
								value: "modern",
								label: t("uiModern")
							},
							{
								value: "humanist",
								label: t("uiHumanist")
							}
						],
						codeOptions: [
							{
								value: "system-mono",
								label: t("codeSystem")
							},
							{
								value: "jetbrains",
								label: t("codeJetbrains")
							},
							{
								value: "fira",
								label: t("codeFira")
							}
						],
						localFamilies: localFonts.families,
						builtinGroupLabel: t("builtinFonts"),
						localGroupLabel: t("systemFonts"),
						fontBookStatus,
						loadFontsLabel: t(localFonts.status === "ready" ? "refreshFonts" : "loadFonts"),
						loadingFonts: localFonts.status === "loading",
						canLoadFonts,
						disabled: editorDisabled,
						onLoadFonts: () => {
							localFonts.load();
						},
						onUiFontChange: (value) => controller.setUiFont(value),
						onCodeFontChange: (value) => controller.setCodeFont(value)
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(EffectsControls, {
						title: t("effects"),
						translucentLabel: t("translucentSidebar"),
						translucentHint: t("translucentHint"),
						contrastLabel: t("contrast"),
						contrastHint: t("contrastHint"),
						translucentSidebar: state.draft.translucentSidebar,
						contrast: state.draft.contrast,
						disabled: editorDisabled,
						onTranslucentChange: (value) => controller.setTranslucentSidebar(value),
						onContrastChange: (value) => controller.setContrast(value)
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: PrettySection_module_css_default.liveRegion,
						"aria-live": "polite",
						"aria-atomic": "true",
						children: correctionMessage
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SettingsActionBar, {
						resetLabel: t("reset"),
						discardLabel: t("discard"),
						saveLabel: state.saveStatus === "saving" ? t("saving") : t(state.draft.enabled ? "save" : "saveDisabled"),
						statusLabel: actionStatus,
						dirty,
						saving: state.saveStatus === "saving",
						saveDisabled: !dirty || disabled,
						onReset: () => {
							controller.reset();
						},
						onDiscard: () => controller.discard(),
						onSave: () => {
							controller.save();
						}
					})
				]
			});
		}
		//#endregion
		//#region src/client/pretty/state/config-form-adapter.ts
		function project(snapshot) {
			return {
				status: snapshot.status,
				...snapshot.value?.theme === void 0 ? {} : { theme: clonePrettyTheme(snapshot.value.theme) },
				...snapshot.revision === void 0 ? {} : { revision: snapshot.revision },
				writable: snapshot.writable,
				mode: snapshot.mode,
				overridden: typeof snapshot.user === "object" && snapshot.user !== null && "theme" in snapshot.user
			};
		}
		var ConfigFormAdapter = class {
			form;
			constructor(form) {
				this.form = form;
			}
			getSnapshot() {
				return project(this.form.getSnapshot());
			}
			subscribe(listener) {
				return this.form.subscribe(listener);
			}
			async saveTheme(theme, expectedRevision) {
				try {
					return await this.form.mutate([{
						op: "set",
						path: ["theme"],
						value: clonePrettyTheme(theme)
					}], expectedRevision) ? "saved" : "conflict";
				} catch {
					return "error";
				}
			}
			async resetTheme(expectedRevision) {
				try {
					return await this.form.mutate([{
						op: "unset",
						path: ["theme"]
					}], expectedRevision) ? "saved" : "conflict";
				} catch {
					return "error";
				}
			}
		};
		//#endregion
		//#region src/client/pretty/state/pretty-settings-controller.ts
		var PrettySettingsController = class {
			settings;
			theme;
			store = createPrettySettingsStore();
			unsubscribe;
			disposed = false;
			constructor(settings, theme) {
				this.settings = settings;
				this.theme = theme;
				this.unsubscribe = settings.subscribe(() => {
					this.adopt(settings.getSnapshot());
				});
				this.adopt(settings.getSnapshot());
			}
			setEnabled(enabled) {
				this.edit((draft) => ({
					...draft,
					enabled
				}));
			}
			selectPreset(id) {
				this.edit((draft) => applyPreset(draft, id));
			}
			updatePalette(mode, field, color) {
				this.edit((draft) => {
					const palette = {
						...draft[mode],
						[field]: color
					};
					const correction = field === "background" || field === "foreground" ? ensureReadableForeground(palette.foreground, palette.background) : void 0;
					if (correction?.corrected === true) palette.foreground = correction.color;
					return {
						...draft,
						preset: "custom",
						[mode]: palette,
						...correction?.corrected === true ? { __message: `contrast:${mode}:${correction.color}` } : {}
					};
				});
			}
			setUiFont(uiFont) {
				this.edit((draft) => ({
					...draft,
					uiFont
				}));
			}
			setCodeFont(codeFont) {
				this.edit((draft) => ({
					...draft,
					codeFont
				}));
			}
			setTranslucentSidebar(translucentSidebar) {
				this.edit((draft) => ({
					...draft,
					translucentSidebar
				}));
			}
			setContrast(contrast) {
				this.edit((draft) => ({
					...draft,
					contrast: Math.round(Math.min(100, Math.max(0, contrast)))
				}));
			}
			discard() {
				const state = this.store.getSnapshot();
				if (state.status !== "ready") return;
				const persisted = clonePrettyTheme(state.persisted);
				this.store.set({
					...state,
					draft: persisted,
					saveStatus: "idle",
					message: void 0
				});
				this.theme.restore(persisted);
			}
			reloadLatest() {
				const snapshot = this.settings.getSnapshot();
				if (snapshot.status !== "ready" || snapshot.theme === void 0) return;
				this.setReady(snapshot.theme, snapshot.revision ?? 0, "idle");
			}
			async save() {
				const state = this.store.getSnapshot();
				if (state.status !== "ready" || state.saveStatus === "saving" || state.saveStatus === "conflict") return;
				const draft = clonePrettyTheme(state.draft);
				this.store.set({
					...state,
					saveStatus: "saving",
					message: void 0
				});
				const result = await this.settings.saveTheme(draft, state.revision);
				if (this.disposed || this.store.getSnapshot().status !== "ready") return;
				if (result === "saved") {
					const next = this.settings.getSnapshot();
					this.setReady(next.theme ?? draft, next.revision ?? state.revision + 1, "saved", "saved");
					return;
				}
				this.markFailure(result);
			}
			async reset() {
				const state = this.store.getSnapshot();
				if (state.status !== "ready" || state.saveStatus === "saving") return;
				this.store.set({
					...state,
					saveStatus: "saving",
					message: void 0
				});
				const result = await this.settings.resetTheme(state.revision);
				if (this.disposed || this.store.getSnapshot().status !== "ready") return;
				if (result === "saved") {
					const next = this.settings.getSnapshot();
					this.setReady(next.theme ?? clonePrettyTheme(DEFAULT_PRETTY_THEME), next.revision ?? state.revision + 1, "saved", "reset");
					return;
				}
				this.markFailure(result);
			}
			dispose() {
				if (this.disposed) return;
				this.disposed = true;
				const state = this.store.getSnapshot();
				if (state.status === "ready" || state.status === "readonly") this.theme.restore(state.persisted);
				this.unsubscribe();
				this.theme.dispose();
			}
			edit(update) {
				const state = this.store.getSnapshot();
				if (state.status !== "ready" || state.saveStatus === "saving" || state.saveStatus === "conflict") return;
				const { __message, ...next } = update(clonePrettyTheme(state.draft));
				const draft = clonePrettyTheme(next);
				this.store.set({
					...state,
					draft,
					saveStatus: "idle",
					message: __message
				});
				this.theme.preview(draft);
			}
			adopt(snapshot) {
				if (this.disposed) return;
				if (snapshot.status === "loading") {
					this.store.set({ status: "loading" });
					return;
				}
				const persisted = clonePrettyTheme(snapshot.theme ?? DEFAULT_PRETTY_THEME);
				if (snapshot.status === "unavailable" || !snapshot.writable || snapshot.mode === "memory") {
					this.store.set({
						status: "readonly",
						reason: snapshot.mode === "memory" ? "remote-memory" : "settings-unavailable",
						persisted
					});
					this.theme.restore(persisted);
					return;
				}
				const revision = snapshot.revision ?? 0;
				const current = this.store.getSnapshot();
				if (current.status === "ready" && revision === current.revision) return;
				if (current.status === "ready" && current.saveStatus !== "saving" && isDirty(current)) {
					this.store.set({
						...current,
						saveStatus: "conflict",
						message: "external-change"
					});
					return;
				}
				this.setReady(persisted, revision, current.status === "ready" && current.saveStatus === "saving" ? "saved" : "idle");
			}
			setReady(theme, revision, saveStatus, message) {
				const persisted = clonePrettyTheme(theme);
				this.store.set({
					status: "ready",
					persisted,
					draft: clonePrettyTheme(persisted),
					revision,
					saveStatus,
					...message === void 0 ? {} : { message }
				});
				this.theme.restore(persisted);
			}
			markFailure(result) {
				const state = this.store.getSnapshot();
				if (state.status !== "ready") return;
				this.store.set({
					...state,
					saveStatus: result,
					message: result === "conflict" ? "external-change" : "save-error"
				});
			}
		};
		//#endregion
		//#region src/client/pretty/theme/dsh-theme-adapter.ts
		const OVERRIDE_SOURCE = "dsh-pretty-extension";
		var DshThemeAdapter = class {
			theme;
			release;
			constructor(theme) {
				this.theme = theme;
			}
			preview(config) {
				this.replace(config);
			}
			restore(config) {
				this.replace(config);
			}
			clear() {
				this.release?.();
				this.release = void 0;
			}
			dispose() {
				this.clear();
			}
			replace(config) {
				this.clear();
				if (!config.enabled) return;
				this.release = this.theme.overrideTokens(OVERRIDE_SOURCE, deriveThemeTokens(config));
			}
		};
		//#endregion
		//#region src/client/pretty/theme/local-font-catalog.ts
		var BrowserLocalFontCatalog = class {
			query;
			supported;
			constructor(query) {
				this.query = query;
				this.supported = query !== void 0;
			}
			async loadFamilies() {
				if (this.query === void 0) throw new DOMException("Local Font Access is unavailable", "NotSupportedError");
				const fonts = await this.query();
				const families = /* @__PURE__ */ new Set();
				for (const font of fonts) {
					if (typeof font.family !== "string") continue;
					const family = font.family.trim();
					if (family.startsWith(".") || !isLocalFontFamily(family)) continue;
					families.add(family);
				}
				return [...families].sort((left, right) => left.localeCompare(right, void 0, { sensitivity: "base" }));
			}
		};
		function createBrowserLocalFontCatalog() {
			const owner = globalThis;
			return new BrowserLocalFontCatalog(typeof owner.queryLocalFonts === "function" ? owner.queryLocalFonts.bind(owner) : void 0);
		}
		//#endregion
		//#region \0pretty-css:src/client/pretty/theme/SessionRowTheme.module.css.mjs
		const css = "[role=treeitem][aria-selected=true]{background:var(--dsh-pretty-session-row-selected,var(--dsw-alias-interactive-bg-hover))}";
		const tagId = "dsh-pretty-extension/SessionRowTheme.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-pretty-extension";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		//#endregion
		//#region src/client/index.ts
		const NS = "settings.pretty";
		const PLUGIN_ID = "dsh-pretty-extension";
		const inject = [
			"slots",
			"locale",
			"configForms",
			"theme"
		];
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "pretty: localized settings copy");
			const controller = new PrettySettingsController(new ConfigFormAdapter(ctx.configForms.get(PRETTY_SETTINGS_NAMESPACE)), new DshThemeAdapter(ctx.theme));
			const t = ctx.locale.bind(NS);
			const fontCatalog = createBrowserLocalFontCatalog();
			const injected = () => ({
				controller,
				fontCatalog,
				hooks: { pretty: controller.store },
				initialMode: ctx.theme.getTheme().active.colorScheme,
				t
			});
			ctx.effect(() => () => {
				controller.dispose();
				if (typeof document !== "undefined") document.querySelectorAll(`style[data-plugin=${JSON.stringify(PLUGIN_ID)}]`).forEach((node) => node.remove());
			}, "pretty: restore theme and remove owned styles");
			ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "pretty",
				order: 100,
				label: () => t("nav"),
				inject: injected
			}, PrettySection));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map