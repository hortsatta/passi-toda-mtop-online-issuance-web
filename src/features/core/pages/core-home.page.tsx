import { BaseScene } from '#/base/components/base-scene.component';
import { FranchiseInitialCheckerForm } from '#/franchise/components/franchise-initial-checker-form.component';

export function CoreHomePage() {
  return (
    <BaseScene className='px-4 xl:px-0'>
      <div className='flex flex-col justify-between gap-6 pt-0 lg:flex-row lg:gap-2.5 lg:pt-4 xl:pt-24'>
        <div className='flex max-w-none flex-col gap-2.5 lg:max-w-[640px]'>
          <span className='text-3xl font-bold leading-snug md:text-4xl xl:text-5xl'>
            Register and Renew your Motorized Tricycle Operator's Permits with
            ease.
          </span>
          <p className='max-w-none text-lg leading-7 text-white/50 md:leading-[2.2] lg:max-w-[620px]'>
            Easily submit applications, upload necessary documents, track the
            status of your permits, and receive approvals all from the comfort
            of your home or office. Say goodbye to long queues and complex
            paperwork, and say hello to a more organized and transparent
            process.
          </p>
        </div>
        <FranchiseInitialCheckerForm className='mx-auto min-h-[360px]' />
      </div>
    </BaseScene>
  );
}
