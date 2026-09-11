import type { Receipt } from "./types";
import { buildReceiptFromFixtures } from "./fixtures";
import type { Scenario } from "./types";

const globalStore = globalThis as unknown as {
  __rrStore?: Map<string, Receipt>;
};

function store(): Map<string, Receipt> {
  if (!globalStore.__rrStore) {
    globalStore.__rrStore = new Map();
    // Seed demo receipts
    const pass = buildReceiptFromFixtures("pass");
    const fail = buildReceiptFromFixtures("fail");
    const warn = buildReceiptFromFixtures("warn");
    globalStore.__rrStore.set(pass.receipt_id, pass);
    globalStore.__rrStore.set(fail.receipt_id, fail);
    globalStore.__rrStore.set(warn.receipt_id, warn);
    globalStore.__rrStore.set("demo", pass);
    globalStore.__rrStore.set("demo-fail", fail);
    globalStore.__rrStore.set("demo-warn", warn);
  }
  return globalStore.__rrStore;
}

export function getReceipt(id: string): Receipt | undefined {
  return store().get(id);
}

export function putReceipt(receipt: Receipt): Receipt {
  store().set(receipt.receipt_id, receipt);
  return receipt;
}

export function generateFromFixtures(scenario: Scenario = "pass"): Receipt {
  const base = buildReceiptFromFixtures(scenario);
  const stamp = Date.now().toString(36);
  const receipt: Receipt = {
    ...base,
    receipt_id: `rr-${scenario}-${stamp}`,
    created_at: new Date().toISOString(),
  };
  return putReceipt(receipt);
}

export function ensureDemo(): void {
  store();
}
