"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const openai_1 = __importDefault(require("openai"));
const client = new openai_1.default({
    baseURL: "https://models.github.ai/inference",
    apiKey: process.env["GITHUB_TOKEN"], // Use the API key from the environment
});
function handlePrompt(prompt, model) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        var _d, _e;
        try {
            const stream = yield client.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                model: model,
                temperature: 1,
                max_tokens: 4096,
                top_p: 1,
                stream: true, // Enable streaming
            });
            let responseText = "";
            try {
                // Stream the response in real-time
                for (var _f = true, stream_1 = __asyncValues(stream), stream_1_1; stream_1_1 = yield stream_1.next(), _a = stream_1_1.done, !_a; _f = true) {
                    _c = stream_1_1.value;
                    _f = false;
                    const chunk = _c;
                    const content = ((_e = (_d = chunk.choices[0]) === null || _d === void 0 ? void 0 : _d.delta) === null || _e === void 0 ? void 0 : _e.content) || "";
                    responseText += content;
                    process.stdout.write(content); // Stream to terminal
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_f && !_a && (_b = stream_1.return)) yield _b.call(stream_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            console.log("\n\nFinal Response:", responseText);
        }
        catch (err) {
            console.error("Error processing prompt:", err);
        }
    });
}
// Example usage
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Processing template prompt...");
    yield handlePrompt("Give the React code for a to-do list creation", "openai/gpt-4o");
    console.log("\nProcessing another prompt...");
    yield handlePrompt("What is 2+2?", "openai/gpt-4o");
}))();
