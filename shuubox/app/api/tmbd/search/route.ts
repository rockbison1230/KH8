import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_URL = "https://api.themoviedb.org/3";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!TMDB_API_KEY) {
    return NextResponse.json(
      { error: "TMDB API key not configured" },
      { status: 500 }
    );
  }

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const searchUrl = `${TMDB_URL}/search/movie?query=${encodeURIComponent(
      query
    )}&api_key=${TMDB_API_KEY}`;
    
    const res = await fetch(searchUrl);
    
    if (!res.ok) {
      throw new Error(`TMDB API failed with status ${res.status}`);
    }
    
    const data = await res.json();
    
    // We only want a few results, and we'll clean them up
    const results = data.results.slice(0, 5).map((movie: any) => ({
      tmdbId: movie.id,
      title: movie.title,
      posterPath: movie.poster_path 
        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
        : "https://placehold.co/200x300?text=No+Image",
      releaseYear: movie.release_date ? movie.release_date.split("-")[0] : "N/A",
    }));

    return NextResponse.json({ results });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
