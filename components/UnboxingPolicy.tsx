import { IconCheck, IconCircleCheck, IconCircleX, IconInfoTriangle, IconX } from "@tabler/icons-react";

export default function UnboxingPolicyBanner() {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-secondary backdrop-blur-2xl saturate-200 rounded-lg p-4">
          {/* Header with icon */}
          <div className="flex gap-3 mb-4 items-center">
            <div className="text-xl flex-shrink-0 "><IconInfoTriangle/></div>
            <div>
              <h3 className="text-sm font-semibold  mb-1">
                Unboxing Policy
              </h3>
              <p className="text-xs text-muted-foreground">
                Required for all returns & damage claims
              </p>
            </div>
          </div>
  
          {/* Main requirement */}
          <div className="bg-amber-100 rounded-md p-3 mb-4 border-l-4 border-amber-400">
            <p className="text-sm text-gray-900 leading-relaxed mb-2">
              Record a <strong>360° video</strong> of your unopened package before opening it.
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Include all sides and angles. Keep the recording uncut.
            </p>
          </div>
  
          {/* Consequences */}
          <div className="space-y-3">
            {/* Positive outcome */}
            <div className="flex gap-2">
              <div className="text-base flex-shrink-0 text-amber-600"><IconCircleCheck size={18}/></div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Video available: Your return or damage claim will be <strong>processed</strong>
              </p>
            </div>
  
            {/* Negative outcome */}
            <div className="flex gap-2">
              <div className="text-base flex-shrink-0 text-red-600"><IconCircleX size={18}/></div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                No video: Return or damage claim will be <strong>rejected</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }