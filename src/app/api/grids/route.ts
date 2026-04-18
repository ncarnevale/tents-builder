import { CreateGridParams } from "@/app/services/types";
import { supabase } from "../../lib/supabase";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const body: CreateGridParams = await req.json();

  const { width, height, treeCoordinates, tentCoordinates, author, isPublic } =
    body;

  const id = nanoid(8);

  const { error } = await supabase.from("grids").insert({
    id,
    width,
    height,
    tent_coordinates: tentCoordinates,
    tree_coordinates: treeCoordinates,
    author,
    is_public: isPublic,
  });

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return Response.json({ id });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const isPublic = searchParams.get("public");

  let query = supabase
    .from("grids")
    .select("id, author, width, height, created_at");

  if (isPublic === "true") {
    query = query.eq("is_public", true);
  }

  const { data, error } = await query;

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return Response.json(data);
}
