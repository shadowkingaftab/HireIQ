import { useState } from "react";
import Mascot from "../Mascot";

export default function OrioGreeting() {
  const [tap, setTap] = useState(0);

  return (
    <div className="orio-greeting relative z-10 mx-auto w-full" aria-label="ORIO greeting">
      <style>{`
        @keyframes orio-greeting-breathe {
          0%, 100% { transform: translateY(0) rotate(-1deg); }
          50% { transform: translateY(-5px) rotate(1deg); }
        }
        @keyframes orio-greeting-wave {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          20% { transform: rotate(-4deg) translateY(-2px); }
          45% { transform: rotate(3deg) translateY(-5px); }
          70% { transform: rotate(-2deg) translateY(-2px); }
        }
        @keyframes orio-greeting-blink {
          0%, 47%, 51%, 100% { transform: scaleY(1); }
          49% { transform: scaleY(0.08); }
        }
        @keyframes orio-greeting-type {
          0% { clip-path: inset(0 100% 0 0); }
          52%, 78% { clip-path: inset(0 0 0 0); }
          100% { clip-path: inset(0 100% 0 0); }
        }
        @keyframes orio-greeting-caret {
          0%, 48%, 100% { opacity: 1; }
          49%, 98% { opacity: 0; }
        }
        @keyframes orio-greeting-shadow {
          0%, 100% { transform: translateX(-50%) scaleX(1); opacity: .42; }
          50% { transform: translateX(-50%) scaleX(.68); opacity: .2; }
        }
        .orio-greeting { height: 180px; max-width: 440px; margin-top: 2px; }
        .orio-greeting-bubble {
          position: absolute; z-index: 3; top: 0; left: 50%; transform: translateX(-50%);
          max-width: calc(100vw - 36px); padding: 10px 16px; border: 1px solid rgba(255,154,40,.48); border-radius: 999px;
          color: #fff; background: rgba(6,17,27,.78); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
          font: 650 15px/1.2 ui-sans-serif,system-ui,sans-serif; white-space: nowrap;
          box-shadow: 0 4px 14px rgba(2,7,10,.2);
        }
        .orio-greeting-bubble::after { content:""; position:absolute; left:50%; bottom:-5px; width:9px; height:9px; transform:translateX(-50%) rotate(45deg); border-right:1px solid rgba(255,154,40,.48); border-bottom:1px solid rgba(255,154,40,.48); background:rgba(6,17,27,.9); }
        .orio-greeting-message { display:inline-block; width:max-content; clip-path:inset(0 100% 0 0); animation:orio-greeting-type 5.2s steps(35,end) infinite; }
        .orio-greeting-message::after { content:""; display:inline-block; height:.9em; margin-left:3px; border-right:2px solid #ff9a1f; vertical-align:-.08em; animation:orio-greeting-caret .72s steps(1,end) infinite; }
        .orio-greeting-figure { position:absolute; left:50%; bottom:0; width:184px; height:116px; transform:translateX(-50%); display:flex; justify-content:center; align-items:flex-end; }
        .orio-greeting-shadow { position:absolute; left:50%; bottom:2px; width:112px; height:15px; border-radius:50%; background:radial-gradient(ellipse,rgba(1,8,24,.72) 0%,rgba(1,8,24,.34) 38%,rgba(1,8,24,0) 76%); filter:blur(2px); transform:translateX(-50%); animation:orio-greeting-shadow 4.2s ease-in-out infinite; }
        .orio-greeting-action { position:relative; z-index:1; display:flex; justify-content:center; align-items:flex-end; height:108px; padding:0; border:0; background:transparent; cursor:pointer; transform-origin:center bottom; animation:orio-greeting-breathe 4.2s ease-in-out infinite; }
        .orio-greeting-action:focus-visible { outline:2px solid #ff9a28; outline-offset:5px; border-radius:24px; }
        .orio-greeting-gesture { display:flex; justify-content:center; align-items:flex-end; transform-origin:center bottom; }
        .orio-greeting-gesture.is-tapped { animation:orio-greeting-wave 650ms ease-in-out 1; }
        .orio-greeting-mascot { display:block; width:156px; height:auto; }
        .orio-greeting .orio-mascot-eyes { transform-box:fill-box; transform-origin:center; animation:orio-greeting-blink 5s linear infinite; }
        @media(max-width:767px) {
          .orio-greeting { height:154px; max-width:360px; }
          .orio-greeting-bubble { padding:9px 13px; font-size:13px; }
          .orio-greeting-figure { width:142px; height:99px; }
          .orio-greeting-action { height:92px; }
          .orio-greeting-mascot { width:124px; }
        }
        @media(prefers-reduced-motion:reduce) {
          .orio-greeting-action,.orio-greeting .orio-mascot-eyes,.orio-greeting-shadow,.orio-greeting-message,.orio-greeting-message::after { animation:none !important; }
          .orio-greeting-shadow { transform:translateX(-50%); opacity:.32; }
          .orio-greeting-message { clip-path:none; }
          .orio-greeting-gesture.is-tapped { animation:none !important; }
        }
      `}</style>

      <div className="orio-greeting-bubble" aria-live="polite" aria-atomic="true">
        <span className="orio-greeting-message">Hi Devs — ORIO is glad you&apos;re here!</span>
      </div>
      <div className="orio-greeting-figure">
        <span className="orio-greeting-shadow" aria-hidden="true" />
        <button
          key={tap}
          type="button"
          className={`orio-greeting-action ${tap ? "is-tapped" : ""}`}
          onClick={() => setTap((count) => count + 1)}
          aria-label="Tap ORIO to say hello"
          title="Tap ORIO to say hello"
        >
          <span key={tap} className={`orio-greeting-gesture ${tap ? "is-tapped" : ""}`}>
            <Mascot className="orio-greeting-mascot" title="" />
          </span>
        </button>
      </div>
    </div>
  );
}
