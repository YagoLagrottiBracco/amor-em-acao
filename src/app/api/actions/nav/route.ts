import { NextResponse } from "next/server";
import { getRecentNavActionsAsync, getAllActionsAsync } from "@/lib/actions";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const navActions = await getRecentNavActionsAsync(3);
    const { actions } = await getAllActionsAsync({ includeDrafts: false });

    return NextResponse.json({
      navActions,
      totalCount: actions.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar ações do menu", navActions: [], totalCount: 0 },
      { status: 500 }
    );
  }
}
