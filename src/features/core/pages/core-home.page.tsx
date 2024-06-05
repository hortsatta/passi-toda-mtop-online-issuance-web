import { BaseScene } from '#/base/components/base-scene.component';
import { FranchiseCheckerForm } from '#/franchise/components/franchise-checker-form.component';

export function CoreHomePage() {
  return (
    <BaseScene>
      <div className='flex justify-between pt-6'>
        <div className='w-fill flex max-w-[640px] flex-col gap-2.5'>
          <span className='text-5xl font-bold leading-snug'>
            Register and Renew your Motorized Tricycle Operator's Permits with
            ease.
          </span>
          <p className='max-w-[620px] text-lg leading-[2.2] text-white/50'>
            Easily submit applications, upload necessary documents, track the
            status of your permits, and receive approvals all from the comfort
            of your home or office. Say goodbye to long queues and complex
            paperwork, and say hello to a more organized and transparent
            process.
          </p>
        </div>
        <FranchiseCheckerForm className='min-h-[360px]' />
      </div>
    </BaseScene>
  );
}
