"use server";

export async function uploadAction(formData: FormData) {
  try {
    const files = formData.getAll("files");
    console.log(files);

    for (const f of files) {
      if (f instanceof File) {
        const buf = await f.arrayBuffer();
        const size = buf.byteLength;
        console.log("[server action] Received file:", f.name, size, "bytes");
      } else {
        console.log("[server action] Field value:", String(f));
      }
    }

    // server actions used as form actions should return void (or nothing)
    return;
  } catch (err) {
    console.error("[server action] Error:", err);
    return;
  }
}
