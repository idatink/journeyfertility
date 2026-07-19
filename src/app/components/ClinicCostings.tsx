import { useState, Fragment } from 'react';
import { ArrowUpDown, Download, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { ClinicDetailedCostings } from './ClinicDetailedCostings';
import { AtHomeTestKitsComparison } from './AtHomeTestKitsComparison';

interface ClinicCostingsProps {
  serviceType: 'egg-freezing' | 'embryo' | 'ivf' | 'fertility';
  atHomeOnly?: boolean;
}

interface ClinicCost {
  id: number;
  clinicName: string;
  location: string;
  consultation: number;
  eggRetrieval: number;
  ivfCycle: number;
  embryoTransfer: number;
  medications: number;
  storagePerYear: number;
  geneticTesting: number;
  successRate: number;
  total: number;
}

interface AtHomeTestKit {
  id: number;
  name: string;
  provider: string;
  price: number;
  testsIncluded: string[];
  turnaroundTime: string;
  hsaEligible: boolean;
  nurseConsult: boolean;
  rating: number;
  reviews: number;
  badge?: string;
}

const mockClinicData: ClinicCost[] = [
  {
    id: 1,
    clinicName: "Reproductive Health Center",
    location: "New York, NY",
    consultation: 350,
    eggRetrieval: 8500,
    ivfCycle: 12000,
    embryoTransfer: 4500,
    medications: 4500,
    storagePerYear: 800,
    geneticTesting: 3500,
    successRate: 68,
    total: 34150
  },
  {
    id: 2,
    clinicName: "Fertility Institute of LA",
    location: "Los Angeles, CA",
    consultation: 300,
    eggRetrieval: 9200,
    ivfCycle: 13500,
    embryoTransfer: 5000,
    medications: 5200,
    storagePerYear: 950,
    geneticTesting: 4000,
    successRate: 71,
    total: 38150
  },
  {
    id: 3,
    clinicName: "Boston IVF",
    location: "Boston, MA",
    consultation: 400,
    eggRetrieval: 8000,
    ivfCycle: 11500,
    embryoTransfer: 4200,
    medications: 4000,
    storagePerYear: 750,
    geneticTesting: 3200,
    successRate: 65,
    total: 32050
  },
  {
    id: 4,
    clinicName: "Chicago Fertility Center",
    location: "Chicago, IL",
    consultation: 325,
    eggRetrieval: 7800,
    ivfCycle: 10800,
    embryoTransfer: 3900,
    medications: 3800,
    storagePerYear: 700,
    geneticTesting: 3000,
    successRate: 62,
    total: 30325
  },
  {
    id: 5,
    clinicName: "Pacific Fertility",
    location: "San Francisco, CA",
    consultation: 450,
    eggRetrieval: 10000,
    ivfCycle: 14500,
    embryoTransfer: 5500,
    medications: 5800,
    storagePerYear: 1000,
    geneticTesting: 4500,
    successRate: 73,
    total: 41750
  },
  {
    id: 6,
    clinicName: "Texas Fertility Clinic",
    location: "Austin, TX",
    consultation: 275,
    eggRetrieval: 7200,
    ivfCycle: 10000,
    embryoTransfer: 3600,
    medications: 3500,
    storagePerYear: 650,
    geneticTesting: 2800,
    successRate: 59,
    total: 28025
  },
  {
    id: 7,
    clinicName: "Memorial Bahçelievler IVF Center",
    location: "Istanbul, Turkey",
    consultation: 150,
    eggRetrieval: 3200,
    ivfCycle: 4500,
    embryoTransfer: 1800,
    medications: 2000,
    storagePerYear: 400,
    geneticTesting: 1500,
    successRate: 64,
    total: 13550
  },
  {
    id: 8,
    clinicName: "Acıbadem Maslak Hospital IVF",
    location: "Istanbul, Turkey",
    consultation: 200,
    eggRetrieval: 3500,
    ivfCycle: 5000,
    embryoTransfer: 2000,
    medications: 2200,
    storagePerYear: 450,
    geneticTesting: 1800,
    successRate: 67,
    total: 15150
  },
  {
    id: 9,
    clinicName: "Istanbul Fertility Center",
    location: "Istanbul, Turkey",
    consultation: 120,
    eggRetrieval: 2800,
    ivfCycle: 4200,
    embryoTransfer: 1600,
    medications: 1800,
    storagePerYear: 350,
    geneticTesting: 1400,
    successRate: 61,
    total: 12270
  },
  {
    id: 10,
    clinicName: "American Hospital IVF Clinic",
    location: "Istanbul, Turkey",
    consultation: 250,
    eggRetrieval: 4000,
    ivfCycle: 5500,
    embryoTransfer: 2200,
    medications: 2400,
    storagePerYear: 500,
    geneticTesting: 2000,
    successRate: 69,
    total: 16850
  },
  {
    id: 11,
    clinicName: "Jinemed Hospital Women's Health",
    location: "Istanbul, Turkey",
    consultation: 180,
    eggRetrieval: 3400,
    ivfCycle: 4800,
    embryoTransfer: 1900,
    medications: 2100,
    storagePerYear: 420,
    geneticTesting: 1600,
    successRate: 66,
    total: 14400
  },
  {
    id: 12,
    clinicName: "Medipol Mega Hospital IVF",
    location: "Istanbul, Turkey",
    consultation: 160,
    eggRetrieval: 3100,
    ivfCycle: 4400,
    embryoTransfer: 1700,
    medications: 1900,
    storagePerYear: 380,
    geneticTesting: 1500,
    successRate: 63,
    total: 13140
  }
];

// Function to get service-specific data and calculate totals
function getServiceData(serviceType: 'egg-freezing' | 'embryo' | 'ivf' | 'fertility') {
  return mockClinicData.map(clinic => {
    let total = clinic.consultation;
    
    switch (serviceType) {
      case 'egg-freezing':
        // Egg freezing: consultation + egg retrieval + medications + storage
        total = clinic.consultation + clinic.eggRetrieval + clinic.medications + clinic.storagePerYear;
        break;
      case 'embryo':
        // Embryo freezing: consultation + egg retrieval + medications + fertilization + storage
        total = clinic.consultation + clinic.eggRetrieval + clinic.medications + (clinic.ivfCycle * 0.3) + clinic.storagePerYear;
        break;
      case 'ivf':
        // Full IVF: all costs included
        total = clinic.consultation + clinic.eggRetrieval + clinic.ivfCycle + clinic.embryoTransfer + clinic.medications;
        break;
      case 'fertility':
        // Fertility testing: just consultation and basic tests (lower costs)
        total = clinic.consultation + (clinic.eggRetrieval * 0.1);
        break;
    }
    
    return {
      ...clinic,
      total: Math.round(total)
    };
  });
}

export function ClinicCostings({ serviceType, atHomeOnly }: ClinicCostingsProps) {
  const [sortField, setSortField] = useState<keyof ClinicCost>('total');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedClinics, setSelectedClinics] = useState<number[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [viewingClinicDetails, setViewingClinicDetails] = useState<{ 
    id: number; 
    name: string;
    data: {
      consultation: number;
      eggRetrieval: number;
      ivfCycle: number;
      embryoTransfer: number;
      medications: number;
      storagePerYear: number;
      geneticTesting: number;
      total: number;
    }
  } | null>(null);

  const handleSort = (field: keyof ClinicCost) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...getServiceData(serviceType)].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return 0;
  });

  const lowestTotal = Math.min(...sortedData.map(c => c.total));

  const toggleClinicSelection = (id: number) => {
    setSelectedClinics(prev => 
      prev.includes(id) ? prev.filter(clinicId => clinicId !== id) : [...prev, id]
    );
  };

  const toggleRowExpansion = (id: number) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleViewDetails = (clinic: ClinicCost) => {
    setViewingClinicDetails({ 
      id: clinic.id, 
      name: clinic.clinicName,
      data: {
        consultation: clinic.consultation,
        eggRetrieval: clinic.eggRetrieval,
        ivfCycle: clinic.ivfCycle,
        embryoTransfer: clinic.embryoTransfer,
        medications: clinic.medications,
        storagePerYear: clinic.storagePerYear,
        geneticTesting: clinic.geneticTesting,
        total: clinic.total
      }
    });
  };

  // If viewing detailed costings for a specific clinic, show that view
  if (viewingClinicDetails) {
    return (
      <ClinicDetailedCostings 
        clinicName={viewingClinicDetails.name}
        clinicData={viewingClinicDetails.data}
        onBack={() => setViewingClinicDetails(null)}
      />
    );
  }

  // If fertility testing and at-home only selected, show at-home test kits
  if (serviceType === 'fertility' && atHomeOnly) {
    return <AtHomeTestKitsComparison />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl mb-2">Clinic Cost Comparison</h2>
          <p className="text-gray-600">Compare pricing across {mockClinicData.length} fertility clinics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#DEE8FF]/50 p-4 rounded-lg border-l-4 border border-[#A8BEEB]/60 border-l-[#5B6AA5]">
          <div className="text-sm text-[#5B6AA5] mb-1">Lowest Total Cost</div>
          <div className="text-2xl">${Math.min(...mockClinicData.map(c => c.total)).toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">Memorial Bahçelievler</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-[#5B6AA5] mb-1">Average Cost</div>
          <div className="text-2xl">${Math.round(mockClinicData.reduce((acc, c) => acc + c.total, 0) / mockClinicData.length).toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">Across all clinics</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-[#5B6AA5] mb-1">Highest Success Rate</div>
          <div className="text-2xl">{Math.max(...mockClinicData.map(c => c.successRate))}%</div>
          <div className="text-sm text-gray-500 mt-1">Boston IVF</div>
        </div>
        <div className="glass p-4 rounded-xl">
          <div className="text-sm text-[#5B6AA5] mb-1">Clinics Compared</div>
          <div className="text-2xl">{mockClinicData.length}</div>
          <div className="text-sm text-gray-500 mt-1">In your search</div>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedClinics.length === mockClinicData.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedClinics(mockClinicData.map(c => c.id));
                      } else {
                        setSelectedClinics([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead className="w-12"></TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('clinicName')}
                    className="flex items-center gap-1 hover:text-[#5B6AA5]"
                  >
                    Clinic Name
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('consultation')}
                    className="flex items-center gap-1 hover:text-[#5B6AA5]"
                  >
                    Consultation
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('eggRetrieval')}
                    className="flex items-center gap-1 hover:text-[#5B6AA5]"
                  >
                    Egg Retrieval
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('ivfCycle')}
                    className="flex items-center gap-1 hover:text-[#5B6AA5]"
                  >
                    IVF Cycle
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('embryoTransfer')}
                    className="flex items-center gap-1 hover:text-[#5B6AA5]"
                  >
                    Embryo Transfer
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('medications')}
                    className="flex items-center gap-1 hover:text-[#5B6AA5]"
                  >
                    Medications
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('successRate')}
                    className="flex items-center gap-1 hover:text-[#5B6AA5]"
                  >
                    Success Rate
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('total')}
                    className="flex items-center gap-1 hover:text-[#5B6AA5]"
                  >
                    Total Cost
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((clinic) => (
                <Fragment key={clinic.id}>
                  <TableRow className={selectedClinics.includes(clinic.id) ? 'bg-[#EEF2FE]' : clinic.total === lowestTotal ? 'bg-[#DEE8FF]/40' : ''}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedClinics.includes(clinic.id)}
                        onCheckedChange={() => toggleClinicSelection(clinic.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleRowExpansion(clinic.id)}
                        className="hover:text-[#5B6AA5]"
                      >
                        {expandedRows.includes(clinic.id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          {clinic.clinicName}
                          {clinic.total === lowestTotal && (
                            <span className="grain text-[10px] font-semibold uppercase tracking-wide text-[#5B6AA5] bg-[#DEE8FF]/70 px-2 py-0.5 rounded-full whitespace-nowrap">
                              Best value
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{clinic.location}</div>
                      </div>
                    </TableCell>
                    <TableCell>${clinic.consultation.toLocaleString()}</TableCell>
                    <TableCell>${clinic.eggRetrieval.toLocaleString()}</TableCell>
                    <TableCell>${clinic.ivfCycle.toLocaleString()}</TableCell>
                    <TableCell>${clinic.embryoTransfer.toLocaleString()}</TableCell>
                    <TableCell>${clinic.medications.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#A8BEEB] h-2 rounded-full"
                            style={{ width: `${clinic.successRate}%` }}
                          />
                        </div>
                        <span className="text-sm">{clinic.successRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#5B6AA5]">${clinic.total.toLocaleString()}</TableCell>
                  </TableRow>
                  
                  {expandedRows.includes(clinic.id) && (
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={10} className="p-6">
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <h4 className="mb-3 text-gray-700">Additional Costs</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Storage (per year):</span>
                                  <span>${clinic.storagePerYear.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Genetic Testing:</span>
                                  <span>${clinic.geneticTesting.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="mb-3 text-gray-700">Clinic Details</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Insurance Accepted:</span>
                                  <span className="text-green-600">Yes</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Payment Plans:</span>
                                  <span className="text-green-600">Available</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border-t pt-4">
                            <div className="flex gap-3 justify-end">
                              <Button variant="outline" size="sm">View Full Details</Button>
                              <Button variant="outline" size="sm">Book Consultation</Button>
                              <Button className="bg-[#2F3440] hover:bg-[#5B6AA5]" size="sm" onClick={() => handleViewDetails(clinic)}>
                                See clinic costings
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer Actions */}
      {selectedClinics.length > 0 && (
        <div className="flex items-center justify-between p-4 glass rounded-xl">
          <div className="text-sm">
            <span className="text-[#5B6AA5]">{selectedClinics.length} clinic{selectedClinics.length > 1 ? 's' : ''}</span> selected
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">Compare Selected</Button>
            <Button size="sm">Contact Selected Clinics</Button>
          </div>
        </div>
      )}
    </div>
  );
}