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
const express_1 = __importDefault(require("express"));
const openai_1 = __importDefault(require("openai"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const client = new openai_1.default({
    baseURL: "https://models.github.ai/inference",
    apiKey: process.env["GITHUB_TOKEN"], // Use the API key from the environment
});
// Endpoint to handle template-based prompts
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    var _d, _e;
    const prompt = req.body.prompt;
    try {
        const stream = yield client.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "openai/gpt-4o",
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
        res.json({ response: responseText });
    }
    catch (err) {
        console.error("Error processing template request:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Endpoint to handle chat-based prompts
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_2, _b, _c;
    var _d, _e;
    const messages = req.body.messages;
    try {
        const stream = yield client.chat.completions.create({
            messages: messages,
            model: "openai/gpt-4o",
            temperature: 1,
            max_tokens: 4096,
            top_p: 1,
            stream: true, // Enable streaming
        });
        let responseText = "";
        try {
            // Stream the response in real-time
            for (var _f = true, stream_2 = __asyncValues(stream), stream_2_1; stream_2_1 = yield stream_2.next(), _a = stream_2_1.done, !_a; _f = true) {
                _c = stream_2_1.value;
                _f = false;
                const chunk = _c;
                const content = ((_e = (_d = chunk.choices[0]) === null || _d === void 0 ? void 0 : _d.delta) === null || _e === void 0 ? void 0 : _e.content) || "";
                responseText += content;
                process.stdout.write(content); // Stream to terminal
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (!_f && !_a && (_b = stream_2.return)) yield _b.call(stream_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        res.json({ response: responseText });
    }
    catch (err) {
        console.error("Error processing chat request:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}));
// Start the server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
