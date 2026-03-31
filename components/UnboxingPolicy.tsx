export default function UnboxingPolicyBanner() {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          {/* Header with icon */}
          <div className="flex gap-3 mb-4">
            <div className="text-xl flex-shrink-0 mt-0.5">⚠️</div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Unboxing Policy
              </h3>
              <p className="text-xs text-gray-600">
                Required for all returns & damage claims
              </p>
            </div>
          </div>
  
          {/* Main requirement */}
          <div className="bg-white rounded-md p-3 mb-4 border-l-4 border-amber-400">
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
              <div className="text-base flex-shrink-0 text-amber-600">✓</div>
              <p className="text-xs text-gray-700 leading-relaxed">
                Video available: Your return or damage claim will be <strong>processed</strong>
              </p>
            </div>
  
            {/* Negative outcome */}
            <div className="flex gap-2">
              <div className="text-base flex-shrink-0 text-red-600">✕</div>
              <p className="text-xs text-gray-700 leading-relaxed">
                No video: Return or damage claim will be <strong>rejected</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }