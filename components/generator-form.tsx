"use client";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";

export default function GeneratorForm() {
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const mutation = useMutation({
    mutationFn: async (payload: { url?: string; imageUrl?: string }) => {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return await res.json();
    },
    onMutate: () => setProgress(20),
    onSuccess: (data) => {
      setProgress(100);
      setImage(data.image);
      setCaption(data.caption);
      if (data.infoMessage) setInfoMessage(data.infoMessage);
    },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white/5 p-4 border border-white/10 grid gap-3">
        <Input
          value={url}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUrl(e.target.value)
          }
          placeholder="Wklej link do produktu"
        />
        <Input
          value={imageUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setImageUrl(e.target.value)
          }
          placeholder="Lub URL zdjęcia"
        />
        <Button
          onClick={() => mutation.mutate({ url, imageUrl })}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Generowanie..." : "Generuj"}
        </Button>
      </div>

      {mutation.isPending && (
        <motion.div className="rounded-2xl bg-white/5 p-4 border border-white/10 space-y-3">
          <div className="text-sm opacity-80">Generowanie...</div>
          <Progress value={progress} />
        </motion.div>
      )}

      {infoMessage && (
        <div className="rounded-xl bg-white/10 p-3 text-sm text-center">
          {infoMessage}
        </div>
      )}

      {image && (
        <motion.div className="rounded-2xl bg-white/5 p-4 border border-white/10 grid md:grid-cols-2 gap-4">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-black/30">
            <img
              src={image}
              alt="generated"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="space-y-3">
            <Textarea
              value={caption}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setCaption(e.target.value)
              }
            />
            <div className="flex flex-wrap gap-2">
              <form
                action="/api/publish/facebook"
                method="post"
                className="contents"
              >
                <input type="hidden" name="image" value={image} />
                <input type="hidden" name="caption" value={caption} />
                <Button type="submit">Publikuj na Facebooku</Button>
              </form>
              <form
                action="/api/publish/instagram"
                method="post"
                className="contents"
              >
                <input type="hidden" name="image" value={image} />
                <input type="hidden" name="caption" value={caption} />
                <Button variant="ghost" type="submit">
                  Publikuj na Instagramie
                </Button>
              </form>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Edytuj post</Button>
                </DialogTrigger>
                <DialogContent>
                  <div className="space-y-3">
                    <div className="text-lg font-semibold">Edycja posta</div>
                    <Textarea
                      value={caption}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setCaption(e.target.value)
                      }
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
