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
            Operations
          </h2>

          <div className="space-y-3">

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.operations.addition}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    operations: {
                      ...settings.operations,
                      addition: event.target.checked,
                    },
                  })
                }
              />
              Addition
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.operations.subtraction}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    operations: {
                      ...settings.operations,
                      subtraction: event.target.checked,
                    },
                  })
                }
              />
              Subtraction
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.operations.multiplication}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    operations: {
                      ...settings.operations,
                      multiplication: event.target.checked,
                    },
                  })
                }
              />
              Multiplication
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.operations.division}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    operations: {
                      ...settings.operations,
                      division: event.target.checked,
                    },
                  })
                }
              />
              Division
            </label>

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