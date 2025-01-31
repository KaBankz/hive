export async function POST(req: Request) {
  const formData = await req.formData();

  const response = await fetch(`${process.env.HIVEMIND_API_URL}/ask`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  return Response.json(data);
}
