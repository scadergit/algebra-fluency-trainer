import { Card } from "../../shared/components/Card";
import { Page } from "../../shared/components/Page";

import { useSettings } from "./SettingsContext";

export default function SettingsPage() {
  const { settings, setSettings } = useSettings();

  return (
    <Page title="Settings">
      <Card>
        <div className="space-y-6">
          <div>
            <label className="block font-medium">
              Maximum Number
            </label>

            <input
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

            <div>{settings.maxNumber}</div>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.allowNegativeNumbers}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  allowNegativeNumbers: event.target.checked,
                })
              }
            />

            Allow Negative Numbers
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.allowNegativeAnswers}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  allowNegativeAnswers: event.target.checked,
                })
              }
            />

            Allow Negative Answers
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.allowFractions}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  allowFractions: event.target.checked,
                })
              }
            />

            Allow Fractions
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.allowDecimals}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  allowDecimals: event.target.checked,
                })
              }
            />

            Allow Decimals
          </label>
        </div>
      </Card>
    </Page>
  );
}