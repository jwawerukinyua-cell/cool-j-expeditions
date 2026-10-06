import { useState, useEffect } from "react";
import { X, Smartphone, Check, Loader2, CreditCard, ShieldCheck, Download, CheckCircle2 } from "lucide-react";
import { MpesaReceipt } from "../types";

interface MpesaSimModalProps {
  isOpen: boolean;
  onClose: () => void;
  usdAmount: number;
  quoteId: string;
}

export default function MpesaSimModal({ isOpen, onClose, usdAmount, quoteId }: MpesaSimModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [payStep, setPayStep] = useState<"input" | "stk-ping" | "pin-entry" | "polling" | "receipt">("input");
  const [pin, setPin] = useState("");
  const [pollingSeconds, setPollingSeconds] = useState(3);
  const [receipt, setReceipt] = useState<MpesaReceipt | null>(null);

  // KES Exchange Rate conversion (Set to 10 KES for seamless testing as requested)
  const kesAmount = 10;

  useEffect(() => {
    if (!isOpen) {
      // resets
      setPayStep("input");
      setPhoneNumber("");
      setPin("");
      setReceipt(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTriggerPush = async () => {
    // Basic Safaricom verification in Kenya (07xx or 01xx or +254xx)
    const regex = /^(?:254|\+254|0)?(7\d{8}|1\d{8})$/;
    if (!regex.test(phoneNumber.trim())) {
      setPhoneError("Please enter a valid Kenya Safaricom phone number (e.g. 0712345678)");
      return;
    }
    setPhoneError("");

    setPayStep("stk-ping");
    // Auto-advance to pin entry after 1.5 seconds representation
    setTimeout(() => {
      setPayStep("pin-entry");
    }, 1800);
  };

  const handlePinSubmit = () => {
    if (pin.length < 4) {
      return alert("M-Pesa PIN is typically 4 or 5 digits.");
    }
    setPayStep("polling");

    // Poll endpoint representation
    fetch("/api/mpesa-express", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: phoneNumber, amount: kesAmount, quoteId })
    })
      .then(res => res.json())
      .then(data => {
        // Step 2: Poll transaction state after simulated user push
        setTimeout(() => {
          fetch("/api/mpesa-poll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transactionId: data.transactionId })
          })
            .then(res => res.json())
            .then(pollData => {
              if (pollData.status === "SUCCESS") {
                setReceipt(pollData.receipt);
                setPayStep("receipt");
              }
            });
        }, 2200);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#EEE8DF] overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-[#0b3d2e] p-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-serif font-bold text-lg">Local M-Pesa Payments Secure Sim</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 bg-[#FAF9F6]">

          {/* STEP 1: Enter Safaricom Number */}
          {payStep === "input" && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">Lipa na M-Pesa Express</h4>
                  <p className="text-xs text-emerald-800 leading-normal mt-0.5">
                    Transacting locally inside Kenya has never been faster. We use direct STK push to send a prompt directly to your Safaricom mobile phone screen. Set up sandbox simulation below.
                  </p>
                </div>
              </div>

              <div className="mt-2 text-center p-3 bg-[#FCFAF5] rounded-xl border border-[#EEE8DF]">
                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Invoice</span>
                <div className="text-2xl font-black text-[#0b3d2e] mt-1">
                  KES {kesAmount.toLocaleString()} <span className="text-xs text-gray-500 font-normal">≈ ${usdAmount.toLocaleString()} USD</span>
                </div>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5">Quote Reference: {quoteId}</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b3d2e] uppercase tracking-wider mb-1.5">
                  Safaricom Phone Number:
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. 0712345678"
                    className="w-full pl-10 pr-4 py-2 text-sm border border-[#DDD5C7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A24A] bg-white text-[#1a1a1a]"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    id="mpesa-number-input"
                  />
                </div>
                {phoneError && <p className="text-xs text-red-600 mt-1.5 font-medium">{phoneError}</p>}
              </div>

              <button
                onClick={handleTriggerPush}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                id="mpesa-push-trigger-btn"
              >
                <Smartphone className="h-4 w-4" />
                Initialize M-Pesa Express Push
              </button>
            </div>
          )}

          {/* STEP 2: STK PUSH SENDING PING */}
          {payStep === "stk-ping" && (
            <div className="py-8 text-center space-y-4">
              <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mx-auto" />
              <h4 className="text-base font-bold text-[#0b3d2e]">Sending Push Notification...</h4>
              <p className="text-xs text-gray-600 max-w-xs mx-auto">
                We are sending a Lipa na M-Pesa prompt directly to your phone. Ensure your mobile screen is unlocked.
              </p>
            </div>
          )}

          {/* STEP 3: PHONE PIN SIMULATOR SCREEN */}
          {payStep === "pin-entry" && (
            <div className="space-y-4">
              <div className="border-4 border-[#333] rounded-3xl p-4 bg-[#111] text-white shadow-xl max-w-[280px] mx-auto overflow-hidden">
                <div className="bg-[#1e1e1e] p-3.5 rounded-2xl text-center space-y-3.5 border border-white/10">
                  <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-black">M-PESA EXPRESS DIRECT</span>
                  <p className="text-xs text-left leading-normal text-white">
                    Do you want to send KES <strong>{kesAmount.toLocaleString()}</strong> direct to <strong>John Mwangi (0720572251)</strong>?
                  </p>
                  <div>
                    <input
                      type="password"
                      maxLength={5}
                      placeholder="Enter M-Pesa PIN"
                      className="w-full py-1 text-center bg-black border border-white/20 text-white rounded text-sm focus:outline-none focus:border-emerald-500 transition-colors tracking-widest font-mono font-bold"
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                      id="mpesa-pin-sim-input"
                    />
                    <span className="text-[9px] text-gray-400 mt-1 block">Simulated Sandbox PIN</span>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setPayStep("input")}
                      className="px-2.5 py-1 text-[10px] text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePinSubmit}
                      className="px-3.5 py-1 text-[10px] bg-emerald-500 hover:bg-emerald-600 rounded text-white font-bold transition-colors"
                      id="mpesa-pin-confirm-btn"
                    >
                      Confirm OK
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-center text-gray-500 italic">
                Simulating a secure Safaricom SIM prompt overlays over your screen inside Kenya.
              </p>
            </div>
          )}

          {/* STEP 4: POLLING / PROCESSING */}
          {payStep === "polling" && (
            <div className="py-8 text-center space-y-4 animate-pulse">
              <Loader2 className="h-12 w-12 text-[#C9A24A] animate-spin mx-auto" />
              <h4 className="text-base font-bold text-[#0b3d2e]">Verifying Kenya Bank settlement...</h4>
              <p className="text-xs text-gray-500">
                Safaricom verification channel processing securely. (Takes approx. 2 seconds)...
              </p>
            </div>
          )}

          {/* STEP 5: DETAILED TAX INVOICE RECEIPT */}
          {payStep === "receipt" && receipt && (
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto text-emerald-500 border border-emerald-200">
                <Check className="h-6 w-6" />
              </div>
              <h4 className="text-center text-base font-bold text-[#0b3d2e] -mt-1">Transaction Verified!</h4>

              {/* Virtual Receipt Paper */}
              <div className="bg-[#FFF] border border-[#DDD5C7] p-5 rounded-lg shadow-sm font-mono text-xs relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-[#C9A24A]" />
                <div className="text-center font-bold text-sm uppercase tracking-wide text-[#0b3d2e] mb-0.5">
                  Cool J Expeditions
                </div>
                <div className="text-center text-[10px] text-gray-500 font-sans mb-3">
                  (The Great South Outdoors and Climbers)
                </div>

                <div className="space-y-2 border-b border-[#F2ECE2] pb-3 text-gray-600">
                  <div className="flex justify-between">
                    <span>Receipt No:</span>
                    <span className="font-bold text-[#111]">{receipt.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reference:</span>
                    <span className="font-bold text-[#111]">{quoteId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gateway:</span>
                    <span className="font-bold text-[#111]">{receipt.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sent Direct to:</span>
                    <span className="font-bold text-[#111]">John Mwangi (0720572251)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sender:</span>
                    <span className="font-bold text-[#111]">{phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Timestamp:</span>
                    <span className="font-bold text-[#111]">{new Date(receipt.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-3 flex justify-between font-bold text-[#0b3d2e] text-sm">
                  <span>AMOUNT INSTANTLY RECONCILED:</span>
                  <span>KES {kesAmount.toLocaleString()}</span>
                </div>

                <div className="mt-4 p-2 bg-emerald-50 border border-emerald-100 rounded text-center text-[10px] text-emerald-800 leading-normal font-sans">
                  {receipt.message}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 bg-[#0b3d2e] hover:bg-[#06241c] text-white py-2 rounded-lg text-xs font-bold transition-colors shadow"
                  id="mpesa-receipt-done-btn"
                >
                  Done & Close
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
