import type { DailyLog } from '@/types/dailyReport';

type Props = {
  questions: NonNullable<DailyLog['questions']>;
};

function QuestionRow({
  response,
  isEven,
}: {
  response: NonNullable<
    DailyLog['questions']
  >['details'][number]['responses'][number];
  isEven: boolean;
}) {
  return (
    <tr className={isEven ? 'bg-gray-50/50' : undefined}>
      <td className='p-3 text-xs text-gray-900'>{response.questionText}</td>
      <td className='p-3 text-xs text-gray-900'>{response.responseValue}</td>
      <td className='p-3 text-[10px] text-gray-500'>
        {response.localTzResponseTimeStamp}
      </td>
    </tr>
  );
}

function PersonResponses({
  detail,
  isEven,
}: {
  detail: NonNullable<DailyLog['questions']>['details'][number];
  isEven: boolean;
}) {
  return (
    <>
      <tr>
        <td
          colSpan={3}
          className='border-t border-gray-200 bg-gray-100/50 p-3 text-xs font-medium text-gray-900'>
          {detail.fullName}
        </td>
      </tr>
      {detail.responses
        .sort((a, b) => a.questionSortOrder - b.questionSortOrder)
        .map((response) => (
          <QuestionRow
            key={`${response.questionText}-${response.responseValue}`}
            response={response}
            isEven={isEven}
          />
        ))}
    </>
  );
}

export function QuestionsSection({ questions }: Props) {
  return (
    <div className='overflow-hidden rounded-lg border border-gray-200 bg-white/50'>
      <div className='border-b border-gray-200 bg-gray-50/50 px-4 py-3'>
        <h2 className='text-center text-xs font-semibold uppercase text-gray-700'>
          Questions
        </h2>
      </div>
      <div className='p-4'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-gray-200'>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                Question
              </th>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                Response
              </th>
              <th className='pb-2 text-center text-xs font-medium text-gray-600'>
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {questions.details.map((detail, idx) => (
              <PersonResponses
                key={detail.fullName}
                detail={detail}
                isEven={idx % 2 === 0}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
