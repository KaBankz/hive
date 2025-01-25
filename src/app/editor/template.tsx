export default function EditorTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className='fixed inset-0 z-50 bg-white'>{children}</div>;
}
