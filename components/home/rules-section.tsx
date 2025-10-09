import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import jsPDF from "jspdf";
import bgImage from "../../assets/b2f/2.jpg";

const RulesSection = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateAndDownloadPDF = async () => {
    setIsGenerating(true);

    try {
      // Initialize PDF with better configuration
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Set page margins
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin + 10;

      // Title
      pdf.setFontSize(20);
      pdf.setTextColor(0, 57, 179);
      pdf.text('BET2FUND RULES', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      // Subtitle
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Challenge & Risk Management Guidelines', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Helper function to add section
      const addSection = (title: string, content: string[]) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = margin + 10;
        }

        // Section title
        pdf.setFontSize(14);
        pdf.setTextColor(0, 57, 179);
        pdf.text(title, margin, yPosition);
        yPosition += 8;

        // Section content
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);

        content.forEach((item) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = margin + 10;
          }

          // Split long text into multiple lines
          const lines = pdf.splitTextToSize(item, pageWidth - 2 * margin - 10);
          lines.forEach((line: string) => {
            pdf.text(line, margin + 5, yPosition);
            yPosition += 5;
          });
        });

        yPosition += 5; // Space between sections
      };

      // Add sections
      addSection('Profit Targets', [
        '• Achieve a 33% profit target within the evaluation period',
        '• Minimum 5 picking days required during the evaluation'
      ]);

      addSection('Risk Management', [
        '• Overall drawdown: 20% — Your account equity must not fall more than 20% below its highest peak during the challenge.',
        '• Daily drawdown: 15% — You may not lose more than 15% of the account equity in a single calendar day.',
        '• No overnight positions on major news events and adhere to all risk management protocols.'
      ]);

      addSection('Profit Distribution', [
        '• You keep up to 80% of profits depending on the chosen plan and performance tier',
        '• Payouts are processed bi-weekly via cryptocurrency to your designated wallet address',
        '• Minimum payout threshold of $100'
      ]);

      addSection("Permitted Markets", [
        "• Major sports leagues (NFL, NBA, MLB, NHL, Soccer, etc.)",
        "• Pre-game and live betting markets",
        "• Moneyline, spread, totals, and major prop markets",
      ]);

      // Restrictions subsection
      pdf.setFontSize(12);
      pdf.setTextColor(200, 0, 0);
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin + 10;
      }
      pdf.text("Market Restrictions:", margin, yPosition);
      yPosition += 6;

      pdf.setFontSize(10);
      [
        "• No parlays with more than 3 legs",
        "• No exotic or highly volatile markets",
      ].forEach((item) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin + 10;
        }
        pdf.text(item, margin + 5, yPosition);
        yPosition += 5;
      });
      yPosition += 5;

      addSection("Scaling Opportunities", [
        "• After 3 consecutive profitable months, eligible for account size increase",
        "• Account increases by 25% to 100% based on performance",
        "• Profit split increases by 5% after 6 months of consistent profitability",
      ]);

      addSection("Prohibited Activities", [
        "• No arbitrage betting or matched betting strategies",
        // "• No use of automated betting systems or bots",
        "• No sharing accounts or cooperation with other traders",
        "• No exploitation of platform errors or technical issues",
      ]);

      // Footer on last page
      const finalPageHeight = pdf.internal.pageSize.getHeight();
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text(
        "© 2025 Bet2Fund. All rights reserved.",
        pageWidth / 2,
        finalPageHeight - 20,
        { align: "center" }
      );
      pdf.text(
        "These rules are subject to change. Please check for updates regularly.",
        pageWidth / 2,
        finalPageHeight - 15,
        { align: "center" }
      );

      // Generate and download PDF
      const pdfBlob = pdf.output("blob");
      const url = URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = 'Bet2Fund-Rules.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Rules PDF Downloaded",
        description: "Rules PDF has been downloaded successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Download Failed",
        description: `Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"
          }`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section id="rules" className="relative py-16 md:py-24 scroll-mt-28">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Challenge <span className="text-primary">Rules</span>
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Clear guidelines to ensure fair and transparent sports picking
            conditions for all participants
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mb-4">
            <motion.div className="bg-[#121212]/50 backdrop-blur-sm p-6 rounded-xl border border-primary/20 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,178,255,0.3)] transition-all duration-300">
              <h3 className="text-xl font-bold mb-3">Profit Targets</h3>
              <p className="text-white/70 flex flex-col gap-2">
                <span>
                  • Achieve a 33% profit target within the evaluation period
                </span>
                <span>
                  • Minimum 5 trading days required during the evaluation
                </span>
              </p>
            </motion.div>

            <motion.div className="bg-[#121212]/50 backdrop-blur-sm p-6 rounded-xl border border-primary/20 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,178,255,0.3)] transition-all duration-300">
              <h3 className="text-xl font-bold mb-3">Risk Management</h3>
              <p className="text-white/70 flex flex-col gap-2">
                <span>• Maximum 15% daily drawdown of account size</span>
                <span>• Maximum 20% overall drawdown of account size</span>
              </p>
            </motion.div>

            <motion.div className="bg-[#121212]/50 backdrop-blur-sm p-6 rounded-xl border border-primary/20 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,178,255,0.3)] transition-all duration-300">
              <h3 className="text-xl font-bold mb-3">Permitted Markets</h3>
              <p className="text-white/70 flex flex-col gap-2">
                <span>
                  • Major sports leagues (NFL, NBA, MLB, NHL, Soccer, etc.)
                </span>
                <span>• Pre-game and live betting markets</span>
                <span>• Moneyline, spread, totals, and major prop markets</span>
              </p>
            </motion.div>

            <motion.div className="bg-[#121212]/50 backdrop-blur-sm p-6 rounded-xl border border-primary/20 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,178,255,0.3)] transition-all duration-300">
              <h3 className="text-xl font-bold mb-3">Market Restrictions</h3>
              <p className="text-white/70 flex flex-col gap-2">
                <span>• No parlays with more than 3 legs</span>
                <span>• No exotic or highly volatile markets</span>
              </p>
            </motion.div>

            <motion.div className="bg-[#121212]/50 backdrop-blur-sm p-6 rounded-xl border border-primary/20 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(0,178,255,0.3)] transition-all duration-300">
              <h3 className="text-xl font-bold mb-3">Prohibited Activities</h3>
              <p className="text-white/70 flex flex-col gap-2">
                <span>
                  • No arbitrage betting or matched betting strategies
                </span>
                <span>
                  • No sharing accounts or cooperation with other traders
                </span>
                <span>
                  • No exploitation of platform errors or technical issues
                </span>
              </p>
            </motion.div>
          </div>

          <Button
            onClick={generateAndDownloadPDF}
            disabled={isGenerating}
            className="inline-block px-8  bg-primary hover:bg-primary/90 text-white rounded-md font-medium shadow-[0_0_15px_rgba(0,178,255,0.7)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating PDF...
              </>
            ) : (
              "Download Callenge Rules PDF"
            )}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default RulesSection;
