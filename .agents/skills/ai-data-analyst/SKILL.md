---
name: ai-data-analyst
description: Performs comprehensive data analysis, visualization, and statistical modeling using Python. Use when analyzing datasets, performing statistical tests, creating visualizations, doing exploratory data analysis, or generating publication-quality analytical reports.
---

<objective>
Perform comprehensive data analysis, statistical modeling, and data visualization by writing and executing self-contained Python scripts. Generate publication-quality charts, statistical reports, and actionable insights from data files or databases.
</objective>

<when_to_use>
Use this skill when you need to:
- Analyze datasets to understand patterns, trends, or relationships
- Perform statistical tests or build predictive models
- Create data visualizations (charts, graphs, dashboards) to communicate findings
- Do exploratory data analysis (EDA) to understand data structure and quality
- Clean, transform, or merge datasets for analysis
- Generate reproducible analysis with documented methodology and code
</when_to_use>

<key_capabilities>
Unlike point-solution data analysis tools:
- **Full Python ecosystem**: Access to pandas, numpy, scikit-learn, statsmodels, matplotlib, seaborn, plotly, and more
- **Runs locally**: Your data stays on your machine; no uploads to third-party services
- **Reproducible**: All analysis is code-based and version controllable
- **Customizable**: Extend with any Python library or custom analysis logic
- **Publication-quality output**: Generate professional charts and reports
- **Statistical rigor**: Access to comprehensive statistical and ML libraries
</key_capabilities>

<required_inputs>
- **Data sources**: CSV files, Excel files, JSON, Parquet, or database connections
- **Analysis goals**: Questions to answer or hypotheses to test
- **Variables of interest**: Specific columns, metrics, or dimensions to focus on
- **Output preferences**: Chart types, report format, statistical tests needed
- **Context**: Business domain, data dictionary, or known data quality issues
</required_inputs>

<out_of_scope>
- Real-time streaming data analysis (use appropriate streaming tools)
- Extremely large datasets requiring distributed computing (use Spark/Dask instead)
- Production ML model deployment (use ML ops tools and infrastructure)
- Live dashboarding (use BI tools like Tableau/Looker for operational dashboards)
</out_of_scope>

<process>
## 1. Data Exploration and Preparation
- Load data and inspect structure (shape, columns, types)
- Check for missing values, duplicates, outliers
- Generate summary statistics (mean, median, std, min, max)
- Visualize distributions of key variables
- Document data quality issues found

## 2. Data Cleaning and Transformation
- Handle missing values (impute, drop, or flag)
- Address outliers if needed (cap, transform, or document)
- Create derived variables if needed
- Normalize or scale variables for modeling
- Split data if doing train/test analysis

## 3. Analysis Execution
- Choose appropriate analytical methods
- Check statistical assumptions
- Execute analysis with proper parameters
- Calculate confidence intervals and effect sizes
- Perform sensitivity analyses if appropriate

## 4. Visualization
- Create exploratory visualizations
- Generate publication-quality final charts
- Ensure all charts have clear labels and titles
- Use appropriate color schemes and styling
- Save in high-resolution formats

## 5. Reporting
- Write clear summary of methods used
- Present key findings with supporting evidence
- Explain practical significance of results
- Document limitations and assumptions
- Provide actionable recommendations

## 6. Reproducibility
- Test that script runs from clean environment
- Document all dependencies
- Add comments explaining non-obvious code
- Include instructions for running analysis
</process>

<conventions>
## Python Environment
- Use virtual environments to isolate dependencies
- Install only necessary packages for the specific analysis
- Document all dependencies in `requirements.txt`

## Code Structure
- Write self-contained scripts that can be re-run by others
- Use clear variable names and add comments for complex logic
- Separate concerns: data loading, cleaning, analysis, visualization
- Save intermediate results to files when analysis is multi-stage

## Data Handling
- Never modify source data files – work on copies or in-memory dataframes
- Document data transformations clearly in code comments
- Handle missing values explicitly and document approach
- Validate data quality before analysis (check for nulls, outliers, duplicates)

## Visualization Best Practices
- Choose appropriate chart types for the data and question
- Use clear labels, titles, and legends on all charts
- Apply appropriate color schemes (colorblind-friendly when possible)
- Include sample sizes and confidence intervals where relevant
- Save visualizations in high-resolution formats (PNG 300 DPI, SVG for vector graphics)

## Statistical Analysis
- State assumptions for statistical tests clearly
- Check assumptions before applying tests (normality, homoscedasticity, etc.)
- Report effect sizes not just p-values
- Use appropriate corrections for multiple comparisons
- Explain practical significance in addition to statistical significance
</conventions>

<required_artifacts>
- **Analysis script(s)**: Well-documented Python code performing the analysis
- **Visualizations**: Charts saved as high-quality image files (PNG/SVG)
- **Analysis report**: Markdown or text document summarizing:
  - Research question and methodology
  - Data description and quality assessment
  - Key findings with supporting statistics
  - Visualizations with interpretations
  - Limitations and caveats
  - Recommendations or next steps
- **Requirements file**: `requirements.txt` with all dependencies
- **Sample data** (if appropriate and non-sensitive): Small sample for reproducibility
</required_artifacts>

<verification>
Run the following to verify the analysis:

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Run analysis script
python analysis.py

# Check outputs generated
ls -lh outputs/
```
</verification>

<success_criteria>
The skill is complete when:
- Analysis script runs without errors from clean environment
- All required visualizations are generated in high quality
- Report clearly explains methodology, findings, and limitations
- Results are interpretable and actionable
- Code is well-documented and reproducible
</success_criteria>

<safety_and_escalation>
- **Data privacy**: Never analyze or share data containing PII without proper authorization
- **Statistical validity**: If sample sizes are too small for reliable inference, call this out explicitly
- **Causal claims**: Avoid implying causation from correlational analysis; be explicit about limitations
- **Model limitations**: Document when models may not generalize or when predictions should not be trusted
- **Data quality**: If data quality issues could materially affect conclusions, flag this prominently
</safety_and_escalation>

<integration>
This skill can be combined with:
- **Internal data querying**: To fetch data from warehouses or databases for analysis
- **Internal tools**: To build analysis tools for non-technical stakeholders
</integration>
