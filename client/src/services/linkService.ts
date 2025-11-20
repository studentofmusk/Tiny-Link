import type { LinkStats } from "../types/linkType";

/* ------------------------------
    GET ALL LINKS
--------------------------------*/
export async function getAllLinks(): Promise<LinkStats[]> {
  try {
    const res = await fetch("/api/links");
    const data = await res.json();

    if (res.status === 200) {
      return data;
    }

    throw new Error("Failed to load links");
  } catch (error) {
    console.error(error);
    throw new Error("Unable to fetch the links. Try again later!");
  }
}

/* -----------------------------------------
    CREATE SHORT LINK
   ----------------------------------------- */
export async function createShortLink(
  target: string,
  code?: string
): Promise<LinkStats> {
  try {
    const body: any = { target: target };
    if (code) body.code = code;

    const res = await fetch("/api/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (res.status === 201) {
      return await res.json();
    }

    if (res.status === 400) {
      throw new Error("Invalid request or code already exists.");
    }

    throw new Error("Something went wrong creating the link.");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/* ------------------------------
    DELETE A LINK
--------------------------------*/
export async function deleteLink(code: string): Promise<"ok" | "notfound" | "invalid" | "error"> {
  try {
    const res = await fetch(`/api/links/${code}`, {
      method: "DELETE",
    });

    if (res.status === 204) return "ok";
    if (res.status === 404) return "notfound";
    if (res.status === 400) return "invalid";

    return "error";
  } catch (error) {
    console.error(error);
    return "error";
  }
}

/* ------------------------------
    COPY SHORT LINK
--------------------------------*/
export async function copyLink(code: string) {
  const tiny = `${window.location.origin}/${code}`;
  await navigator.clipboard.writeText(tiny);
  return tiny;
}
