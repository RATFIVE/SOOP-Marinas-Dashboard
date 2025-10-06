import WindSpeedCard from '@/components/ui/WindSpeedCard'

export default function WindSpeedCardDemo() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Beispiel 1: Moderate Winde aus Westen */}
        <WindSpeedCard
          average={8.6}
          direction={242}
          label="WSW"
          time="13:48:00"
        />
        
        {/* Beispiel 2: Starke Winde aus Norden */}
        <WindSpeedCard
          average={15.2}
          direction={15}
          label="NNE"
          time="14:23:15"
        />
        
        {/* Beispiel 3: Schwache Winde aus Süden */}
        <WindSpeedCard
          average={3.1}
          direction={180}
          label="S"
          time="15:10:42"
        />
      </div>
    </div>
  )
}
