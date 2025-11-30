// Handle Chrome DevTools and other .well-known requests
export async function loader() {
  return new Response(null, {
    status: 204,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export default function WellKnown() {
  return null;
}
