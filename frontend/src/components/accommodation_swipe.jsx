import { useState } from 'react';
import { MapPin, Euro, Home, Info } from 'lucide-react';

const AccommodationSwipe = ({ property, onSwipe, difficulty }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!property) {
    return <div>Loading property...</div>;
  }

  const getGermanVocabulary = () => {
    const vocab = {
      A1: {
        'Apartment': 'Die Wohnung',
        'WG-Zimmer': 'Das WG-Zimmer (shared room)',
        'Villa': 'Die Villa',
        'Mansion': 'Das Herrenhaus',
        'rent': 'die Miete',
        'location': 'der Ort',
        'size': 'die Größe'
      },
      A2: {
        'Einzimmerwohnung': 'One-room apartment',
        'Wohngemeinschaft': 'Shared flat (WG)',
        'Penthouse': 'Das Penthouse',
        'Studentenwohnheim': 'Student dormitory',
        'rent': 'die Miete',
        'location': 'die Lage',
        'size': 'die Größe'
      },
      B1: {
        'Zweizimmerwohnung': 'Two-room apartment',
        'Luxusvilla': 'Luxury villa',
        'Möbliertes Zimmer': 'Furnished room',
        'Altbauwohnung': 'Old building apartment',
        'verkehrsfreundlich': 'transport-friendly',
        'verfügbar': 'available'
      },
      B2: {
        'Dreizimmerwohnung': 'Three-room apartment',
        'Studentenapartment': 'Student apartment',
        'Mikroapartment': 'Micro apartment',
        'Raumaufteilung': 'room layout',
        'Annehmlichkeiten': 'amenities',
        'Wohnlage': 'residential area'
      }
    };
    return vocab[difficulty] || vocab.A1;
  };

  const vocabulary = getGermanVocabulary();

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden shadow-lg border-2 border-gray-200">
        {/* Property Image */}
        <div className="relative h-48 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
          <Home className="w-16 h-16 text-blue-600" />
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-medium">
            {property.type}
          </div>
        </div>

        {/* Property Details */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {property.type}
            </h3>
            <div className="text-lg font-bold text-green-600">
              {property.rent}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{property.location}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Home className="w-4 h-4" />
              <span className="text-sm">{property.size}</span>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed">
              {property.description}
            </p>

            {/* Vocabulary section for learning */}
            {(difficulty === 'A1' || difficulty === 'A2') && (
              <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-1">
                  <Info className="w-4 h-4" />
                  Vocabulary
                </h4>
                <div className="text-xs text-yellow-700 space-y-1">
                  {Object.entries(vocabulary).slice(0, 3).map(([german, english]) => (
                    <div key={german} className="flex justify-between">
                      <span className="font-medium">{german}:</span>
                      <span>{english}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 text-sm underline hover:text-blue-800"
            >
              {showDetails ? 'Hide Details' : 'Show More Details'}
            </button>

            {/* Additional details when expanded */}
            {showDetails && (
              <div className="mt-3 p-3 bg-gray-50 rounded border">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Additional Information
                </h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div><strong>Property Type:</strong> {property.type}</div>
                  <div><strong>Monthly Rent:</strong> {property.rent}</div>
                  <div><strong>Location:</strong> {property.location}</div>
                  <div><strong>Size:</strong> {property.size}</div>
                  {difficulty !== 'A1' && (
                    <div className="mt-2 text-xs">
                      <strong>German Terms:</strong>
                      <div className="ml-2 mt-1">
                        {Object.entries(vocabulary).map(([german, english]) => (
                          <div key={german}>• {german} = {english}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Swipe Instructions */}
        <div className="px-6 pb-4">
          <div className="text-center text-xs text-gray-500">
            Think: Is this suitable for Alex? Consider the price, location, and size.
          </div>
        </div>
      </div>

      {/* Debug info for development (can be removed in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
          <strong>Debug:</strong> Suitable: {property.suitable ? 'Yes' : 'No'} - {property.reason}
        </div>
      )}
    </div>
  );
};

export default AccommodationSwipe;