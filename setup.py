# setup.py
import subprocess
import sys
import os

def install_dependencies():
    """Install required dependencies"""
    
    print("🔧 Setting up Spanish Revision Booklet Generator...")
    
    # Check if pandoc is installed
    try:
        subprocess.run(['pandoc', '--version'], capture_output=True, check=True)
        print("✅ Pandoc is already installed")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Pandoc not found. Please install it:")
        if sys.platform == "darwin":  # macOS
            print("   brew install pandoc")
        elif sys.platform.startswith("linux"):  # Linux
            print("   sudo apt-get install pandoc")
        elif sys.platform == "win32":  # Windows
            print("   Download from: https://pandoc.org/installing.html")
        return False
    
    print("✅ All dependencies ready!")
    return True

def run_generator():
    """Run the main generator script"""
    print("\n🚀 Generating Spanish revision booklet...")
    
    try:
        # Import and run the main function
        from generate_spanish_revision import create_revision_booklet
        create_revision_booklet()
        
        print("\n📚 Files created:")
        print("   - spanish_revision_booklet.md (Markdown source)")
        print("   - spanish_revision_booklet.html (HTML preview)")
        
        # Try to convert to Word document
        try:
            subprocess.run([
                'pandoc', 
                'spanish_revision_booklet.md', 
                '-o', 
                'spanish_revision_booklet.docx'
            ], check=True)
            print("   - spanish_revision_booklet.docx (Word document)")
            print("\n✅ All files generated successfully!")
        except subprocess.CalledProcessError:
            print("\n⚠️  Word conversion failed. Run manually:")
            print("   pandoc spanish_revision_booklet.md -o spanish_revision_booklet.docx")
            
    except Exception as e:
        print(f"❌ Error generating booklet: {e}")
        return False
    
    return True

if __name__ == "__main__":
    if install_dependencies():
        run_generator()