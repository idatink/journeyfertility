import { useState, useRef, Fragment } from 'react';
import { ChevronLeft, Save, Download, Calculator, AlertCircle, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';
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
import { Card } from './ui/card';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ClinicData {
  consultation: number;
  eggRetrieval: number;
  ivfCycle: number;
  embryoTransfer: number;
  medications: number;
  storagePerYear: number;
  geneticTesting: number;
  total: number;
}

interface ClinicDetailedCostingsProps {
  clinicName: string;
  clinicData: ClinicData;
  onBack: () => void;
}

interface CostItem {
  name: string;
  priceList?: number | string;
  round1Actual?: number | string;
  round2Forecast?: number | string;
  round3Forecast?: number | string;
  round1Paid?: boolean;
  round2Paid?: boolean;
  round3Paid?: boolean;
  isExpandable?: boolean;
  subItems?: CostItem[];
}

export function ClinicDetailedCostings({ clinicName, clinicData, onBack }: ClinicDetailedCostingsProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  
  // Initialize cost items with actual clinic data
  const medicationSubtotal = clinicData.medications;
  const [costItems, setCostItems] = useState<CostItem[]>([
    { name: 'Initial Consultation', priceList: clinicData.consultation, round1Actual: clinicData.consultation, round2Forecast: '', round3Forecast: '', round1Paid: false, round2Paid: false, round3Paid: false },
    { name: 'Blood tests & Hormone screening', priceList: 450, round1Actual: 450, round2Forecast: 200, round3Forecast: '', round1Paid: false, round2Paid: false, round3Paid: false },
    { name: 'Ultrasound scans (monitoring)', priceList: 350, round1Actual: 350, round2Forecast: 350, round3Forecast: 350, round1Paid: false, round2Paid: false, round3Paid: false },
    { 
      name: 'Medications (stimulation)', 
      priceList: medicationSubtotal, 
      round1Actual: medicationSubtotal, 
      round2Forecast: medicationSubtotal * 0.9, 
      round3Forecast: medicationSubtotal * 0.85, 
      round1Paid: false, 
      round2Paid: false, 
      round3Paid: false,
      isExpandable: true,
      subItems: [
        { name: 'Gonal-F (follitropin alfa) - 450 IU', priceList: Math.round(medicationSubtotal * 0.35), round1Actual: Math.round(medicationSubtotal * 0.35), round2Forecast: Math.round(medicationSubtotal * 0.9 * 0.35), round3Forecast: Math.round(medicationSubtotal * 0.85 * 0.35), round1Paid: false, round2Paid: false, round3Paid: false },
        { name: 'Menopur (menotropins) - 75 IU', priceList: Math.round(medicationSubtotal * 0.25), round1Actual: Math.round(medicationSubtotal * 0.25), round2Forecast: Math.round(medicationSubtotal * 0.9 * 0.25), round3Forecast: Math.round(medicationSubtotal * 0.85 * 0.25), round1Paid: false, round2Paid: false, round3Paid: false },
        { name: 'Cetrotide (cetrorelix) - 0.25mg', priceList: Math.round(medicationSubtotal * 0.15), round1Actual: Math.round(medicationSubtotal * 0.15), round2Forecast: Math.round(medicationSubtotal * 0.9 * 0.15), round3Forecast: Math.round(medicationSubtotal * 0.85 * 0.15), round1Paid: false, round2Paid: false, round3Paid: false },
        { name: 'Lupron (leuprolide acetate)', priceList: Math.round(medicationSubtotal * 0.10), round1Actual: Math.round(medicationSubtotal * 0.10), round2Forecast: Math.round(medicationSubtotal * 0.9 * 0.10), round3Forecast: Math.round(medicationSubtotal * 0.85 * 0.10), round1Paid: false, round2Paid: false, round3Paid: false },
        { name: 'Ovidrel (trigger shot)', priceList: Math.round(medicationSubtotal * 0.10), round1Actual: Math.round(medicationSubtotal * 0.10), round2Forecast: Math.round(medicationSubtotal * 0.9 * 0.10), round3Forecast: Math.round(medicationSubtotal * 0.85 * 0.10), round1Paid: false, round2Paid: false, round3Paid: false },
        { name: 'Progesterone (Endometrin/Crinone)', priceList: Math.round(medicationSubtotal * 0.05), round1Actual: Math.round(medicationSubtotal * 0.05), round2Forecast: Math.round(medicationSubtotal * 0.9 * 0.05), round3Forecast: Math.round(medicationSubtotal * 0.85 * 0.05), round1Paid: false, round2Paid: false, round3Paid: false },
      ]
    },
    { 
      name: 'Supplements & Vitamins', 
      priceList: 150, 
      round1Actual: 150, 
      round2Forecast: 120, 
      round3Forecast: 100, 
      round1Paid: false, 
      round2Paid: false, 
      round3Paid: false,
      isExpandable: true,
      subItems: [
        { name: 'CoQ10 (200mg daily)', priceList: 35, round1Actual: 35, round2Forecast: 30, round3Forecast: 25, round1Paid: false, round2Paid: false, round3Paid: false },
        { name: 'Prenatal Vitamins', priceList: 30, round1Actual: 30, round2Forecast: 25, round3Forecast: 20, round1Paid: false, round2Paid: false, round3Paid: false },
        { name: 'Vitamin D3 (2000 IU)', priceList: 15, round1Actual: 15, round2Forecast: 12, round3Forecast: 10, round1Paid: false, round2Paid: false, round3Paid: false },
        { name: 'Omega-3 Fish Oil (1000mg)', priceList: 25, round1Actual: 25, round2Forecast: 20, round3Forecast: 18, round1Paid: false, round2Paid: false, round3Paid: false },
        { name: 'DHEA (25mg)', priceList: 20, round1Actual: 20, round2Forecast: 18, round3Forecast: 15, round1Paid: false, round2Paid: false, round3Paid: false },
        { name: 'Myo-Inositol', priceList: 15, round1Actual: 15, round2Forecast: 10, round3Forecast: 8, round1Paid: false, round2Paid: false, round3Paid: false },
        { name: 'Folic Acid (800mcg)', priceList: 10, round1Actual: 10, round2Forecast: 5, round3Forecast: 4, round1Paid: false, round2Paid: false, round3Paid: false },
      ]
    },
    { name: 'Holistic treatment (optional)', priceList: 300, round1Actual: 300, round2Forecast: 300, round3Forecast: 300, round1Paid: false, round2Paid: false, round3Paid: false },
    { name: 'Egg Retrieval Procedure', priceList: clinicData.eggRetrieval, round1Actual: clinicData.eggRetrieval, round2Forecast: clinicData.eggRetrieval * 0.9, round3Forecast: clinicData.eggRetrieval * 0.8, round1Paid: false, round2Paid: false, round3Paid: false },
    { name: 'IVF Cycle (Lab work)', priceList: clinicData.ivfCycle, round1Actual: clinicData.ivfCycle, round2Forecast: clinicData.ivfCycle, round3Forecast: clinicData.ivfCycle, round1Paid: false, round2Paid: false, round3Paid: false },
    { name: 'Embryo Transfer', priceList: clinicData.embryoTransfer, round1Actual: clinicData.embryoTransfer, round2Forecast: clinicData.embryoTransfer, round3Forecast: clinicData.embryoTransfer, round1Paid: false, round2Paid: false, round3Paid: false },
    { name: 'Sedation/Anesthesia', priceList: 500, round1Actual: 500, round2Forecast: 500, round3Forecast: 500, round1Paid: false, round2Paid: false, round3Paid: false },
    { name: 'Genetic Testing (PGT-A)', priceList: clinicData.geneticTesting, round1Actual: clinicData.geneticTesting, round2Forecast: '', round3Forecast: '', round1Paid: false, round2Paid: false, round3Paid: false },
    { name: 'Nurse consultations (extra)', priceList: 200, round1Actual: '', round2Forecast: 200, round3Forecast: 200, round1Paid: false, round2Paid: false, round3Paid: false },
    { name: 'Therapy/Counseling sessions', priceList: 250, round1Actual: '', round2Forecast: 250, round3Forecast: 250, round1Paid: false, round2Paid: false, round3Paid: false },
    { name: 'Annual Storage Fee', priceList: clinicData.storagePerYear, round1Actual: '', round2Forecast: clinicData.storagePerYear, round3Forecast: clinicData.storagePerYear, round1Paid: false, round2Paid: false, round3Paid: false },
  ]);

  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const [savedToDate, setSavedToDate] = useState({ saved: 2500, total: 1800 });
  const [upcomingSavings, setUpcomingSavings] = useState({ upcoming: 3000, total: 2200 });
  const [isExporting, setIsExporting] = useState(false);

  // Calculate totals from actual values
  const calculateTotal = (items: CostItem[], field: keyof CostItem) => {
    return items.reduce((sum, item) => {
      const value = item[field];
      if (typeof value === 'number') return sum + value;
      return sum;
    }, 0);
  };

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const round1Total = calculateTotal(costItems, 'round1Actual');
  const round2Total = calculateTotal(costItems, 'round2Forecast');
  const round3Total = calculateTotal(costItems, 'round3Forecast');
  const round2Saved = Math.round((round1Total - round2Total) * 0.15); // Assume 15% savings from experience
  const round2Downfall = round2Saved - round2Total;
  const cumulative1 = round1Total;
  const cumulative2 = round1Total + round2Total;
  const cumulative3 = cumulative2 + round3Total;
  const totalSaved = savedToDate.saved + savedToDate.total;
  const totalUpcoming = upcomingSavings.upcoming + upcomingSavings.total;
  const shortfall = cumulative3 - totalSaved - totalUpcoming;

  const togglePaid = (index: number, round: 'round1Paid' | 'round2Paid' | 'round3Paid') => {
    const newItems = [...costItems];
    newItems[index][round] = !newItems[index][round];
    setCostItems(newItems);
  };

  const handleExportPDF = async () => {
    if (!tableRef.current) return;
    
    setIsExporting(true);
    
    try {
      // Create a clone to avoid oklch color issues with html2canvas
      const clone = tableRef.current.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      document.body.appendChild(clone);

      // Capture the cloned element as canvas
      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true,
        onclone: (clonedDoc) => {
          // Convert any oklch colors to standard colors in the cloned document
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * { 
              color: #000 !important;
              border-color: #e5e7eb !important;
            }
            .bg-blue-50, .bg-blue-50\\/30 { background-color: #eff6ff !important; }
            .bg-green-50, .bg-green-50\\/30 { background-color: #f0fdf4 !important; }
            .bg-purple-50, .bg-purple-50\\/30 { background-color: #faf5ff !important; }
            .bg-blue-100 { background-color: #dbeafe !important; }
            .bg-green-100 { background-color: #dcfce7 !important; }
            .bg-purple-100 { background-color: #f3e8ff !important; }
            .bg-gray-50 { background-color: #f9fafb !important; }
            .bg-gray-100 { background-color: #f3f4f6 !important; }
            .text-blue-600 { color: #2563eb !important; }
            .text-green-600 { color: #16a34a !important; }
            .text-purple-600 { color: #9333ea !important; }
            .text-red-600 { color: #dc2626 !important; }
            .text-gray-600 { color: #4b5563 !important; }
            .text-gray-500 { color: #6b7280 !important; }
            .border-green-300 { border-color: #86efac !important; }
          `;
          clonedDoc.head.appendChild(style);
        }
      });
      
      // Remove the clone
      document.body.removeChild(clone);
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 297; // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${clinicName}-costings-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('There was an error generating the PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = () => {
    // Save to localStorage or backend
    const dataToSave = {
      clinicName,
      costItems,
      savedToDate,
      upcomingSavings,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(`clinic-costings-${clinicName}`, JSON.stringify(dataToSave));
    alert('Costings saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2 -ml-4">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Comparison
          </Button>
          <h2 className="text-3xl mb-2">My Clinic Costings - {clinicName}</h2>
          <p className="text-gray-600">Track your actual spending and forecast future treatment rounds</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Calculator className="w-4 h-4 mr-2" />
            Calculate
          </Button>
          <Button variant="outline" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" onClick={handleExportPDF} disabled={isExporting}>
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Cost Table */}
        <div className="lg:col-span-3">
          <div className="border rounded-lg overflow-hidden bg-white" ref={tableRef}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="min-w-[250px]">My Clinic<br /><span className="text-xs text-gray-500">Price list</span></TableHead>
                    <TableHead className="text-center bg-blue-50">
                      <div>Actual Spending 1st round</div>
                      <div className="text-xs text-blue-600 mt-1">Mark as paid</div>
                    </TableHead>
                    <TableHead className="text-center bg-green-50">
                      <div>round 2</div>
                      <div className="text-xs text-green-600">Forecast Spending 2nd round</div>
                      <div className="text-xs text-green-600 mt-1">Mark as paid</div>
                    </TableHead>
                    <TableHead className="text-center bg-purple-50">
                      <div>round 3</div>
                      <div className="text-xs text-purple-600">Forecast Spending 3rd round</div>
                      <div className="text-xs text-purple-600 mt-1">Mark as paid</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costItems.map((item, index) => (
                    <Fragment key={index}>
                    <TableRow className={item.isExpandable ? 'cursor-pointer hover:bg-gray-50' : ''}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {item.isExpandable && (
                            <button
                              onClick={() => toggleExpanded(index)}
                              className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                              {expandedItems.includes(index) ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          <span className="flex-1">{item.name}</span>
                          {item.priceList && (
                            <Input
                              type="text"
                              value={item.priceList}
                              className="w-24 h-8 text-right"
                              onChange={(e) => {
                                const newItems = [...costItems];
                                newItems[index].priceList = e.target.value;
                                setCostItems(newItems);
                              }}
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className={`bg-blue-50/30 ${item.round1Paid ? 'bg-green-100' : ''}`}>
                        <div className="flex flex-col items-center gap-1">
                          <Input
                            type="text"
                            value={item.round1Actual || ''}
                            className={`w-20 h-8 text-center ${item.round1Paid ? 'bg-green-50 border-green-300' : ''}`}
                            onChange={(e) => {
                              const newItems = [...costItems];
                              newItems[index].round1Actual = e.target.value;
                              setCostItems(newItems);
                            }}
                          />
                          {item.round1Actual && (
                            <button
                              onClick={() => togglePaid(index, 'round1Paid')}
                              className="hover:opacity-70 transition-opacity"
                              title={item.round1Paid ? 'Mark as unpaid' : 'Mark as paid'}
                            >
                              {item.round1Paid ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <div className="w-4 h-4 border-2 border-gray-400 rounded-sm" />
                              )}
                            </button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className={`bg-green-50/30 ${item.round2Paid ? 'bg-green-100' : ''}`}>
                        <div className="flex flex-col items-center gap-1">
                          <Input
                            type="text"
                            value={item.round2Forecast || ''}
                            className={`w-20 h-8 text-center ${item.round2Paid ? 'bg-green-50 border-green-300' : ''}`}
                            onChange={(e) => {
                              const newItems = [...costItems];
                              newItems[index].round2Forecast = e.target.value;
                              setCostItems(newItems);
                            }}
                          />
                          {item.round2Forecast && (
                            <button
                              onClick={() => togglePaid(index, 'round2Paid')}
                              className="hover:opacity-70 transition-opacity"
                              title={item.round2Paid ? 'Mark as unpaid' : 'Mark as paid'}
                            >
                              {item.round2Paid ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <div className="w-4 h-4 border-2 border-gray-400 rounded-sm" />
                              )}
                            </button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className={`bg-purple-50/30 ${item.round3Paid ? 'bg-green-100' : ''}`}>
                        <div className="flex flex-col items-center gap-1">
                          <Input
                            type="text"
                            value={item.round3Forecast || ''}
                            className={`w-20 h-8 text-center ${item.round3Paid ? 'bg-green-50 border-green-300' : ''}`}
                            onChange={(e) => {
                              const newItems = [...costItems];
                              newItems[index].round3Forecast = e.target.value;
                              setCostItems(newItems);
                            }}
                          />
                          {item.round3Forecast && (
                            <button
                              onClick={() => togglePaid(index, 'round3Paid')}
                              className="hover:opacity-70 transition-opacity"
                              title={item.round3Paid ? 'Mark as unpaid' : 'Mark as paid'}
                            >
                              {item.round3Paid ? (
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                              ) : (
                                <div className="w-4 h-4 border-2 border-gray-400 rounded-sm" />
                              )}
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {/* Render sub-items if expanded */}
                    {item.isExpandable && expandedItems.includes(index) && item.subItems && item.subItems.map((subItem, subIndex) => (
                      <TableRow key={`${index}-${subIndex}`} className="bg-gray-50/50">
                        <TableCell className="pl-12">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700 flex-1">{subItem.name}</span>
                            {subItem.priceList && (
                              <Input
                                type="text"
                                value={subItem.priceList}
                                className="w-20 h-7 text-right text-sm"
                                onChange={(e) => {
                                  const newItems = [...costItems];
                                  if (newItems[index].subItems) {
                                    newItems[index].subItems![subIndex].priceList = e.target.value;
                                    setCostItems(newItems);
                                  }
                                }}
                              />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="bg-blue-50/50">
                          <div className="flex flex-col items-center gap-1">
                            <Input
                              type="text"
                              value={subItem.round1Actual || ''}
                              className="w-20 h-7 text-center text-sm"
                              onChange={(e) => {
                                const newItems = [...costItems];
                                if (newItems[index].subItems) {
                                  newItems[index].subItems![subIndex].round1Actual = e.target.value;
                                  setCostItems(newItems);
                                }
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="bg-green-50/50">
                          <div className="flex flex-col items-center gap-1">
                            <Input
                              type="text"
                              value={subItem.round2Forecast || ''}
                              className="w-20 h-7 text-center text-sm"
                              onChange={(e) => {
                                const newItems = [...costItems];
                                if (newItems[index].subItems) {
                                  newItems[index].subItems![subIndex].round2Forecast = e.target.value;
                                  setCostItems(newItems);
                                }
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="bg-purple-50/50">
                          <div className="flex flex-col items-center gap-1">
                            <Input
                              type="text"
                              value={subItem.round3Forecast || ''}
                              className="w-20 h-7 text-center text-sm"
                              onChange={(e) => {
                                const newItems = [...costItems];
                                if (newItems[index].subItems) {
                                  newItems[index].subItems![subIndex].round3Forecast = e.target.value;
                                  setCostItems(newItems);
                                }
                              }}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    </Fragment>
                  ))}
                  
                  {/* Totals Row */}
                  <TableRow className="border-t-2 border-gray-300">
                    <TableCell></TableCell>
                    <TableCell className="bg-blue-100">
                      <div className="text-center">
                        <div className="text-xs text-gray-600">Total 1st round</div>
                        <div className="text-blue-600">${round1Total.toLocaleString()}</div>
                      </div>
                    </TableCell>
                    <TableCell className="bg-green-100">
                      <div className="text-center">
                        <div className="text-xs text-gray-600">Total 2nd round</div>
                        <div className="text-green-600">${round2Total.toLocaleString()}</div>
                      </div>
                    </TableCell>
                    <TableCell className="bg-purple-100">
                      <div className="text-center">
                        <div className="text-xs text-gray-600">Total 3rd round</div>
                        <div className="text-purple-600">${round3Total.toLocaleString()}</div>
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Saved/Downfall Row */}
                  <TableRow>
                    <TableCell className="text-right">
                      <span className="text-xs text-gray-600">annual freeze storage</span>
                    </TableCell>
                    <TableCell className="text-center text-xs text-gray-500">x</TableCell>
                    <TableCell className="bg-green-50">
                      <div className="text-center text-xs">
                        <div className="text-gray-600">saved</div>
                        <div>{round2Saved}</div>
                        <div className="text-red-600 mt-1">downfall</div>
                        <div className="text-red-600">{round2Downfall}</div>
                      </div>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  {/* Cumulative Row */}
                  <TableRow className="bg-gray-100">
                    <TableCell></TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="text-xs text-gray-600">Cumulative</div>
                        <div>${cumulative1.toLocaleString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="text-xs text-gray-600">Cumulative</div>
                        <div>${cumulative2.toLocaleString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="text-xs text-gray-600">Cumulative</div>
                        <div>${cumulative3.toLocaleString()}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Resources Links */}
          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">CHEAPER MEDICATION</span>
              <a href="http://ivfpharmacy.com/faq/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                http://ivfpharmacy.com/faq/
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm"></span>
              <a href="https://thefertilitymedicationcentre.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                https://thefertilitymedicationcentre.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">IVF PAYMENT INSURANCE</span>
              <a href="https://gaiafamily.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                https://gaiafamily.com/
              </a>
            </div>
          </div>
        </div>

        {/* Saved to Date Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 space-y-6 sticky top-6">
            <div>
              <h3 className="mb-4 text-gray-700">Saved to Date</h3>
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">x</span>
                    <Input
                      type="number"
                      value={savedToDate.saved}
                      className="w-16 h-8 text-right"
                      onChange={(e) => setSavedToDate({ ...savedToDate, saved: Number(e.target.value) })}
                    />
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">x</span>
                    <Input
                      type="number"
                      value={savedToDate.total}
                      className="w-16 h-8 text-right"
                      onChange={(e) => setSavedToDate({ ...savedToDate, total: Number(e.target.value) })}
                    />
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm">Total</span>
                    <span className="text-blue-600">{savedToDate.saved + savedToDate.total}</span>
                  </div>
                </div>

                <div className="border-b pb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">upcoming saving</span>
                    <Input
                      type="number"
                      value={upcomingSavings.upcoming}
                      className="w-16 h-8 text-right"
                      onChange={(e) => setUpcomingSavings({ ...upcomingSavings, upcoming: Number(e.target.value) })}
                    />
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm">Total</span>
                    <span className="text-green-600">{upcomingSavings.upcoming + upcomingSavings.total}</span>
                  </div>
                </div>

                <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Shortfall</span>
                    <span className="text-red-600">${shortfall.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Planned Spend</span>
                <span>${cumulative3.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Saved</span>
                <span className="text-green-600">${(savedToDate.saved + savedToDate.total).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Remaining Budget</span>
                <span className="text-blue-600">${(cumulative3 - shortfall).toLocaleString()}</span>
              </div>
            </div>

            <Button className="w-full">Update Budget Plan</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
