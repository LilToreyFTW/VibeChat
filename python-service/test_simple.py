#!/usr/bin/env python3

import sys
import os

def main():
    print("Simple PyInstaller test")
    print(f"Python version: {sys.version}")
    print(f"Current working directory: {os.getcwd()}")
    print("Test completed successfully!")

if __name__ == "__main__":
    main()
