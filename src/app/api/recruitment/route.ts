import { NextResponse } from "next/server";
import { DEFAULT_CONFIG, type ApplicationInput } from "../../../lib/recruitment";

export async function GET() {
  return NextResponse.json({
    success: true,
    ...DEFAULT_CONFIG,
  });
}

export async function POST(req: Request) {
  try {
    const data: ApplicationInput = await req.json();

    // Check honeypot spam trap
    if (data.website && data.website.trim().length > 0) {
      // Quietly return success to bots
      return NextResponse.json({ success: true, status: "received" });
    }

    const errors: Record<string, string> = {};
    if (!data.name || data.name.trim().length === 0) {
      errors.name = "Full name is required.";
    }
    if (!data.email || !data.email.includes("@")) {
      errors.email = "A valid VIT email is required.";
    } else {
      const isVit = DEFAULT_CONFIG.emailDomains.some((d) =>
        data.email.toLowerCase().endsWith(d)
      );
      if (!isVit) {
        errors.email = "Please use your official VIT student email address (@vitstudent.ac.in).";
      }
    }
    if (!data.regNo || data.regNo.trim().length === 0) {
      errors.regNo = "Registration number is required.";
    }
    if (!data.year || Number.isNaN(Number(data.year))) {
      errors.year = "Please select your year of study.";
    }
    if (!data.roles || data.roles.length === 0) {
      errors.roles = "Please select at least one role.";
    }
    if (!data.why || data.why.trim().length < DEFAULT_CONFIG.limits.whyMin) {
      errors.why = `Please write at least ${DEFAULT_CONFIG.limits.whyMin} characters explaining why you want to join.`;
    }
    if (!data.hoursPerWeek || data.hoursPerWeek < DEFAULT_CONFIG.limits.hoursMin) {
      errors.hoursPerWeek = `Expected at least ${DEFAULT_CONFIG.limits.hoursMin} hours per week.`;
    }
    if (!data.consent) {
      errors.consent = "You must agree before submitting.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { success: false, error: "invalid_fields", errors },
        { status: 400 }
      );
    }

    // Log application for maintainers
    console.log("[Recruitment] New application received:", {
      name: data.name,
      email: data.email,
      regNo: data.regNo,
      year: data.year,
      roles: data.roles,
      hours: data.hoursPerWeek,
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, status: "received" });
  } catch {
    return NextResponse.json(
      { success: false, detail: "Invalid request payload." },
      { status: 400 }
    );
  }
}
