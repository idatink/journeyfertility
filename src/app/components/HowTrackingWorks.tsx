import { FlaskConical, Repeat, HeartPulse, PiggyBank } from 'lucide-react';
import { FERTILITY_TESTS } from '../lib/tests';

/**
 * The one idea this page needs to land: two different things get sold as if you
 * need both, constantly — and you don't.
 *
 *  1. A hormone / reserve check (AMH) is a ONE-OFF baseline. AMH moves over
 *     years, not weeks, so re-buying a panel every month is money wasted.
 *  2. Knowing WHEN you ovulate is ongoing but cheap — strips, apps, body signs.
 *
 * The "from £X" figure is read from the sourced test data so it can never drift
 * from the comparison below it.
 */
function cheapestBaselinePrice(): number | null {
  const withReserve = FERTILITY_TESTS.filter(
    (t) => t.price !== null && t.biomarkers.includes('AMH')
  );
  if (!withReserve.length) return null;
  return Math.min(...withReserve.map((t) => t.price as number));
}

export function HowTrackingWorks() {
  const baseline = cheapestBaselinePrice();

  return (
    <section className="space-y-6" aria-labelledby="how-tracking-heading">
      <div className="max-w-2xl">
        <h2
          id="how-tracking-heading"
          className="text-3xl font-semibold tracking-tight text-[#2F3440] mb-3"
        >
          How fertility tracking works — without overspending
        </h2>
        <p className="text-[#5C6478] leading-relaxed">
          Two very different things get sold as though you need both every month.
          You usually don't. Get your baseline once, then track your cycle for
          pennies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* One-off baseline */}
        <div className="glass rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <span className="grain flex items-center justify-center w-10 h-10 rounded-full bg-[#DEE8FF]/70 text-[#5B6AA5]">
              <FlaskConical className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-[#2F3440]">
                A baseline hormone check
              </h3>
              <p className="text-xs font-medium uppercase tracking-wide text-[#5B6AA5]">
                Do it once
              </p>
            </div>
          </div>
          <p className="text-sm text-[#5C6478] leading-relaxed mb-4">
            An AMH test reads your ovarian reserve — roughly, how many eggs you
            have left. It changes slowly, over years, so a single test gives you
            a picture that holds. There is no reason to re-order it every month.
          </p>
          <div className="mt-auto text-sm text-[#2F3440]">
            {baseline !== null ? (
              <>
                From{' '}
                <span className="font-bold">£{baseline.toLocaleString()}</span>{' '}
                <span className="text-[#5C6478]">one-off</span> — compare the
                tests below.
              </>
            ) : (
              <span className="text-[#5C6478]">Compare the tests below.</span>
            )}
          </div>
        </div>

        {/* Ongoing tracking */}
        <div className="glass rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <span className="grain flex items-center justify-center w-10 h-10 rounded-full bg-[#FCE4D2] text-[#B4762F]">
              <Repeat className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-[#2F3440]">
                Tracking your cycle
              </h3>
              <p className="text-xs font-medium uppercase tracking-wide text-[#B4762F]">
                Ongoing, but cheap
              </p>
            </div>
          </div>
          <p className="text-sm text-[#5C6478] leading-relaxed mb-4">
            To know <em>when</em> you ovulate each month you don't need a lab
            panel — you need the signs your body already gives you:
          </p>
          <ul className="space-y-2 text-sm text-[#2F3440]">
            <li className="flex justify-between gap-3">
              <span>LH ovulation strips</span>
              <span className="text-[#5C6478] shrink-0">~£8–15 / month</span>
            </li>
            <li className="flex justify-between gap-3">
              <span>A free cycle-tracking app</span>
              <span className="text-[#5C6478] shrink-0">£0</span>
            </li>
            <li className="flex justify-between gap-3">
              <span>Cervical mucus &amp; basal body temperature</span>
              <span className="text-[#5C6478] shrink-0">£0</span>
            </li>
          </ul>
        </div>
      </div>

      {/* The trap + the NHS route */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5 flex gap-3">
          <PiggyBank className="w-5 h-5 text-[#B4762F] shrink-0 mt-0.5" />
          <p className="text-sm text-[#5C6478] leading-relaxed">
            <span className="font-semibold text-[#2F3440]">
              Skip the monthly panel.
            </span>{' '}
            A repeat hormone subscription is rarely worth it — your reserve
            hasn't changed since last month. One baseline, then cheap tracking,
            covers most people.
          </p>
        </div>
        <div className="glass rounded-2xl p-5 flex gap-3">
          <HeartPulse className="w-5 h-5 text-[#5B6AA5] shrink-0 mt-0.5" />
          <p className="text-sm text-[#5C6478] leading-relaxed">
            <span className="font-semibold text-[#2F3440]">Ask the NHS first.</span>{' '}
            Your GP can run some hormone bloods and refer you. AMH isn't routine
            on the NHS unless you're referred for treatment — but it's worth
            asking before you pay privately.
          </p>
        </div>
      </div>
    </section>
  );
}
