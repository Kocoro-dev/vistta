import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/geo
 *
 * Server-side geolocation lookup using ip-api.com
 * This avoids Mixed Content issues since server can use HTTP
 */
export async function GET(request: NextRequest) {
  try {
    // Get client IP from headers (set by Vercel/proxy)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const clientIp = forwardedFor?.split(",")[0]?.trim() || realIp || "";

    // Use ip-api.com (free, no API key, HTTP only but that's fine server-side)
    const apiUrl = clientIp
      ? `http://ip-api.com/json/${clientIp}?fields=status,country,countryCode,regionName,city,timezone,isp`
      : `http://ip-api.com/json/?fields=status,country,countryCode,regionName,city,timezone,isp`;

    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error("Geo API request failed");
    }

    const data = await response.json();

    if (data.status !== "success") {
      return NextResponse.json(
        {
          country: null,
          country_code: null,
          region: null,
          city: null,
          timezone: null,
          isp: null,
        },
        {
          headers: {
            "Cache-Control": "public, max-age=3600",
          },
        }
      );
    }

    return NextResponse.json(
      {
        country: data.country || null,
        country_code: data.countryCode || null,
        region: data.regionName || null,
        city: data.city || null,
        timezone: data.timezone || null,
        isp: data.isp || null,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=3600",
        },
      }
    );
  } catch (error) {
    console.error("Geo lookup error:", error);
    return NextResponse.json(
      {
        country: null,
        country_code: null,
        region: null,
        city: null,
        timezone: null,
        isp: null,
      },
      { status: 200 } // Return 200 with null values instead of error
    );
  }
}
