// src/setupTests.js

import { expect, vi } from "vitest";
import "@testing-library/jest-dom";

// Make expect and vi globally available for tests
window.expect = expect;
window.vi = vi;
