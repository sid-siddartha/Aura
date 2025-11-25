"use client";

import { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { processVoiceTransaction } from "@/actions/transaction";
export function VoiceTransactionRecorder({ onVoiceComplete }) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const {
    loading: processing,
    fn: processVoiceFn,
    data: voiceData,
  } = useFetch(processVoiceTransaction);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        await processVoiceFn(audioBlob);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setRecording(true);
      toast.info("🎙️ Listening... Speak your transaction details.");
    } catch (error) {
      toast.error("Microphone access denied or unavailable.");
      console.error(error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      toast.info("Processing your voice...");
    }
  };

  // once data received from LLM
  if (voiceData && !processing) {
    onVoiceComplete(voiceData);
    toast.success("Voice processed successfully!");
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        type="button"
        variant="outline"
        className={`w-full h-10 ${
          recording
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white hover:opacity-90"
        }`}
        onClick={recording ? stopRecording : startRecording}
        disabled={processing}
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            <span>Processing...</span>
          </>
        ) : recording ? (
          <>
            <Square className="mr-2" />
            <span>Stop Recording</span>
          </>
        ) : (
          <>
            <Mic className="mr-2" />
            <span>Record Transaction with Voice</span>
          </>
        )}
      </Button>
    </div>
  );
}
