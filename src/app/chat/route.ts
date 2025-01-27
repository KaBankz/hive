export async function POST(req: Request) {
  const formData = await req.formData();

  const question = formData.get('question');
  const file = formData.get('file');

  console.log(question, file);

  return Response.json({ answer: 'Hello World' });
}
