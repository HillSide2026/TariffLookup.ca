#!/bin/bash
# Safety Rails Script for ll-secondbrain
# Validates repository compliance with system governance rules
#
# Usage: ./scripts/safety-rails.sh [--fix]
#
# Checks:
# 1. .env is not tracked in git
# 2. Stage/phase folder structure matches doctrine
# 3. Agent output files are in allowed locations
# 4. Required frontmatter exists for key artifact types

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$REPO_ROOT"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

echo "================================"
echo "Safety Rails Check"
echo "================================"
echo ""

# -----------------------------------------------------------------------------
# Check 1: .env is not tracked
# -----------------------------------------------------------------------------
echo "Check 1: .env not tracked in git"

if git ls-files --error-unmatch .env 2>/dev/null; then
    echo -e "${RED}FAIL${NC}: .env is tracked in git! Remove it immediately."
    echo "  Run: git rm --cached .env"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}PASS${NC}: .env is not tracked"
fi

# Verify .gitignore contains .env
if grep -q "^\.env$" .gitignore 2>/dev/null; then
    echo -e "${GREEN}PASS${NC}: .gitignore contains .env"
else
    echo -e "${YELLOW}WARN${NC}: .gitignore should contain '.env' entry"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# -----------------------------------------------------------------------------
# Check 2: Stage folder structure matches doctrine
# -----------------------------------------------------------------------------
echo "Check 2: Stage folder structure (per DOCTRINE-2026-004)"

# Check for invalid top-level stage folders (should be STAGE1, STAGE2, etc., not STAGE1.1)
INVALID_STAGES=$(find 04_INITIATIVES/SYSTEM_PORTFOLIO/01_ACTIVE_ROADMAPS -maxdepth 1 -type d -name "STAGE*.*" 2>/dev/null | head -5)
if [ -n "$INVALID_STAGES" ]; then
    echo -e "${RED}FAIL${NC}: Found phase folders at stage level (should be nested):"
    echo "$INVALID_STAGES" | while read -r dir; do echo "  - $dir"; done
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}PASS${NC}: No phase folders at stage level"
fi

# Check archive structure
INVALID_ARCHIVE=$(find 10_ARCHIVE/INITIATIVES/SYSTEM_PORTFOLIO -maxdepth 1 -type d -name "STAGE*.*" 2>/dev/null | head -5)
if [ -n "$INVALID_ARCHIVE" ]; then
    echo -e "${RED}FAIL${NC}: Found phase folders at stage level in archive:"
    echo "$INVALID_ARCHIVE" | while read -r dir; do echo "  - $dir"; done
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}PASS${NC}: Archive structure compliant"
fi

echo ""

# -----------------------------------------------------------------------------
# Check 3: Agent definition files exist and have required sections
# -----------------------------------------------------------------------------
echo "Check 3: System management agent specs in 00_SYSTEM/AGENTS/"

AGENT_DIR="00_SYSTEM/AGENTS"
REQUIRED_AGENTS=("SMA-001_SYSTEM_GOVERNANCE" "SMA-002_PORTFOLIO_PLANNING" "SMA-003_INTEGRATION_STEWARD" "SMA-004_KNOWLEDGE_CURATION" "SMA-005_RUNBOOK_QA")

for agent in "${REQUIRED_AGENTS[@]}"; do
    AGENT_FILE=$(find "$AGENT_DIR" -name "${agent}*.md" 2>/dev/null | head -1)
    if [ -z "$AGENT_FILE" ]; then
        echo -e "${RED}FAIL${NC}: Missing agent definition for $agent"
        ERRORS=$((ERRORS + 1))
    else
        # Check for required sections
        MISSING_SECTIONS=""
        for section in "Authority Scope" "Inputs" "Outputs" "Refusal Conditions"; do
            if ! grep -q "## $section" "$AGENT_FILE" 2>/dev/null; then
                MISSING_SECTIONS="$MISSING_SECTIONS $section,"
            fi
        done

        if [ -n "$MISSING_SECTIONS" ]; then
            echo -e "${YELLOW}WARN${NC}: $agent missing sections:$MISSING_SECTIONS"
            WARNINGS=$((WARNINGS + 1))
        else
            echo -e "${GREEN}PASS${NC}: $agent definition complete"
        fi
    fi
done

echo ""

# -----------------------------------------------------------------------------
# Check 4: Write-back policy exists
# -----------------------------------------------------------------------------
echo "Check 4: Write-back policy"

if [ -f "01_DOCTRINE/02_policies/WRITE_BACK_POLICY.md" ]; then
    echo -e "${GREEN}PASS${NC}: Write-back policy exists"
else
    echo -e "${RED}FAIL${NC}: Missing 01_DOCTRINE/02_policies/WRITE_BACK_POLICY.md"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# -----------------------------------------------------------------------------
# Check 5: Doctrine files have required format
# -----------------------------------------------------------------------------
echo "Check 5: Doctrine file format"

for doctrine_file in $(find 01_DOCTRINE -type f -name "DOCTRINE-*.md" 2>/dev/null); do
    if [ -f "$doctrine_file" ]; then
        # Check for Status field
        if grep -q "Status:" "$doctrine_file" 2>/dev/null; then
            echo -e "${GREEN}PASS${NC}: $(basename "$doctrine_file") has Status field"
        else
            echo -e "${YELLOW}WARN${NC}: $(basename "$doctrine_file") missing Status field"
            WARNINGS=$((WARNINGS + 1))
        fi
    fi
done

echo ""

# -----------------------------------------------------------------------------
# Summary
# -----------------------------------------------------------------------------
echo "================================"
echo "Summary"
echo "================================"
echo -e "Errors:   ${RED}$ERRORS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}Safety rails check FAILED${NC}"
    exit 1
else
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}Safety rails check PASSED with warnings${NC}"
    else
        echo -e "${GREEN}Safety rails check PASSED${NC}"
    fi
    exit 0
fi
