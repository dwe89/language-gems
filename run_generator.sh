#!/bin/bash
# run_generator.sh

echo "🎓 Spanish GCSE Revision Booklet Generator"
echo "=========================================="

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Run the setup and generator
python3 setup.py

echo ""
echo "📖 Open spanish_revision_booklet.html in your browser to preview"
echo "📄 Open spanish_revision_booklet.docx in Microsoft Word to edit"
echo ""
echo "🎉 Done! Your Spanish revision booklet is ready."