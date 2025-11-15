"use client";

import { useEffect } from "react";

export default function ConnectFacebook() {
  useEffect(() => {
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_META_APP_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_META_REDIRECT_FB!,
      scope: "pages_show_list pages_read_engagement pages_manage_posts pages_manage_metadata instagram_basic instagram_content_publish",
      response_type: "code",
    });

    window.location.href =
      "https://www.facebook.com/v20.0/dialog/oauth?" + params.toString();
  }, []);

  return (
    <div className="p-6 text-center">
      Łączenie z Facebookiem…
    </div>
  );
}
