import { Card } from "../../shared/components/Card";
import { Page } from "../../shared/components/Page";

import { useSettings } from "./SettingsContext";

export default function SettingsPage() {
  const { settings, setSettings } = useSettings();

  return (
    <Page title="Settings">
      <div className="space-y-6">

        <Card>
          <h2 className="mb-4 text-xl font-semibold">
            Skills
          </h2>

          <div className="space-y-3">

            {[
              ["addition", "Addition"],
              ["subtraction", "Subtraction"],
              ["multiplication", "Multiplication"],
              ["division", "Division"],
            ].map(([id, label]) => (
              <label
                key={id}
                className="flex items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={settings.enabledSkills.includes(id)}
                  onChange={(event) => {
                    const enabled = new Set(
                      settings.enabledSkills,
                    );

                    if (event.target.checked) {
                      enabled.add(id);
                    } else {
                      enabled.delete(id);
                    }

                    setSettings({
                      ...settings,
                      enabledSkills: [...enabled],
                    });
                  }}
                />

                {label}
              </label>
            ))}

          </div>
        </Card>

        <Card>

          <h2 className="mb-4 text-xl font-semibold">
            Numbers
          </h2>

          <label className="block font-medium">
            Maximum Number
          </label>

          <input
            className="mt-2 w-full"
            type="range"
            min={5}
            max={20}
            value={settings.maxNumber}
            onChange={(event) =>
              setSettings({
                ...settings,
                maxNumber: Number(event.target.value),
              })
            }
          />

          <div className="mt-1">
            {settings.maxNumber}
          </div>

          <label className="mt-6 flex items-center gap-3">
            <input
              type="checkbox"
              checked={
                settings.allowNegativeNumbers
              }
              onChange={(event) =>
                setSettings({
                  ...settings,
                  allowNegativeNumbers:
                    event.target.checked,
                })
              }
            />

            Allow Negative Numbers
          </label>

          <label className="mt-3 flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.allowFractions}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  allowFractions:
                    event.target.checked,
                })
              }
            />

            Allow Fractions
          </label>

          <label className="mt-3 flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.allowDecimals}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  allowDecimals:
                    event.target.checked,
                })
              }
            />

            Allow Decimals
          </label>

        </Card>

        <Card>

          <h2 className="mb-4 text-xl font-semibold">
            Answers
          </h2>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={
                settings.allowNegativeAnswers
              }
              onChange={(event) =>
                setSettings({
                  ...settings,
                  allowNegativeAnswers:
                    event.target.checked,
                })
              }
            />

            Allow Negative Answers
          </label>

        </Card>

      </div>
    </Page>
  );
}