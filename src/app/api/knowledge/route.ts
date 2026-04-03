import { NextResponse } from "next/server";
import { getKnowledgeRepository } from "@/lib/knowledge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const records = await getKnowledgeRepository().getAllRecords();
  const filtered = type ? records.filter((record) => record.type === type) : records;
  return NextResponse.json(filtered, { status: 200 });
}
