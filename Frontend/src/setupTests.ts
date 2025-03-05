import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from 'util';

// Polyfill TextEncoder and TextDecoder for Jest tests
global.TextEncoder = TextEncoder;
class CustomTextDecoder extends TextDecoder {}
global.TextDecoder = CustomTextDecoder as any;
