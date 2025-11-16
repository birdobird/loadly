"use client";

import { useEffect } from "react";

export default function ConnectInstagram() {
  useEffect(() => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_META_APP_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_META_REDIRECT_IG!,
      scope: [
        "instagram_basic",
        "instagram_content_publish",
        "pages_show_list",
      ].join(","),
      response_type: "code",
    });

    window.location.href =
      "https://www.facebook.com/v20.0/dialog/oauth?" + params.toString();
  }, []);

  return (
    <div className="p-8 text-center text-lg">
      Łączenie z Instagramem…  
      <br />
      <span className="opacity-70 text-sm">Przekierowywanie do Facebook Login…</span>
    </div>
  );
}
