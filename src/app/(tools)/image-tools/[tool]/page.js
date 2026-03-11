"use client";
import React from "react";
import { useParams } from "next/navigation";
import ToolInterface from "@/components/ToolInterface";

export default function ImageToolPage() {
    const params = useParams();
    const tool = params.tool || "resizer";

    return <ToolInterface tool={tool} />;
}
