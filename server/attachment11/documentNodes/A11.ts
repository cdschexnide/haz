import { DocumentNode } from "../../attachment3/types";

export const Attachment11: DocumentNode = {
  id: "A11.",
  parentId: "AFMAN24-604",
  title: "CLASS 7--RADIOACTIVE MATERIALS",
  childNodeIds: [
    "A11.1.",
    "A11.2.",
    "A11.3.",
    "A11.4.",
    "Table A11.1.",
    "Table A.11.1. Notes",
    "A11.5.",
    "A11.6.",
    "A11.7.",
    "A11.8.",
    "A11.9.",
    "A11.10.",
    "A11.11.",
    "A11.12.",
  ],
};

export const A11_1: DocumentNode = {
  id: "A11.1.",
  parentId: "A11.",
  title: "General Requirements.",
  bodyText: `For military members, failure to obey the mandatory provisions from paragraphs A11.2. through A11.12. and any provisions of mandatory subparagraph(s) hereunder is a violation of Article 92, Uniform Code of Military Justice (UCMJ). Civilian employees who fail to obey the provisions from paragraph A11.2. through A11.12. and any provisions of mandatory subparagraph(s) hereunder are subject to administrative disciplinary action without regard to otherwise applicable criminal or civil sanctions. Personnel shall not deviate from these provisions and comply with the outer container options as specified in packaging paragraph. <strong>(T-0)</strong>. Not all packaging paragraphs are inclusive and packaging selection is determined by the type of radioactive material. This attachment contains information concerning the packaging and general handling instructions for Class 7 (Radioactive Material). See Attachment 3 for other details concerning Class 7 material.`,
};

export const A11_2: DocumentNode = {
  id: "A11.2.",
  parentId: "A11.",
  title: "Activity Limits for Type A and Type B Packages:",
  childNodeIds: ["A11.2.1.", "A11.2.2."],
};

export const A11_2_1: DocumentNode = {
  id: "A11.2.1.",
  parentId: "A11.2.",
  bodyText: `A Type A package may not contain a quantity of radioactivity greater than A<sub>1</sub> (for special form radioactive material) or A<sub>2</sub> for all other radioactive materials as listed in A11.4. Activity limits not listed in A11.4. are determined per 49 CFR Section 173.433.`,
};

export const A11_2_2: DocumentNode = {
  id: "A11.2.2.",
  parentId: "A11.2.",
  bodyText: `The limits on activity contained in a Type B(U) or Type B(M) package are those prescribed in A11.9. and A11.10. or in the applicable approval certificate in accordance with 49 CFR Sections 173.471, 173.472 or 173.473.`,
};

export const A11_3: DocumentNode = {
  id: "A11.3.",
  parentId: "A11.",
  title: "Determining A1 and A2 Values for Radionuclides:",
  childNodeIds: ["A11.3.1.", "A11.3.2."],
};

export const A11_3_1: DocumentNode = {
  id: "A11.3.1.",
  parentId: "A11.3.",
  bodyText: `For single radionuclides of known identity, the values of A<sub>1</sub> and A<sub>2</sub> are those given in A11.4. The values of A<sub>1</sub> and A<sub>2</sub> are also applicable for radionuclides contained in (a,n) or (h,n) neutron sources.`,
};

export const A11_3_2: DocumentNode = {
  id: "A11.3.2.",
  parentId: "A11.3.",
  bodyText: `Determine values of A<sub>1</sub> and A<sub>2</sub> for any single radionuclide of known identity that is not listed in A11.4. according to 49 CFR Section 173.433.`,
};

export const A11_4: DocumentNode = {
  id: "A11.4.",
  parentId: "A11.",
  title: "Table A11.1.",
  bodyText: `This table gives A<sub>1</sub> and A<sub>2</sub> values for radionuclides. This table also gives values on exempt material activity concentrations and exempt consignment activity limits for radionuclides. The information in this table is taken from 49 CFR Sections 173.435 and 173.436.`,
};

export const A1A2ValuesCommonRadionuclides: DocumentNode = {
  id: "Table A11.1.",
  parentId: "A11.",
  title:
    " Table of A<sub>1</sub> and A<sub>2</sub> Values for Common Radionuclides.",
  bodyText: `
  <table border="1" style="border-collapse: collapse; width: 90%; margin: 20px 0px 20px 0px">
    <thead>
      <tr style="height: 2rem">
        <th style="padding: 0.4rem;">Symbol</th>
        <th style="padding: 0.4rem;">Element and Atomic Number</th>
        <th style="padding: 0.4rem;">A<sub>1</sub> (TBq) (Special Form)</th>
        <th style="padding: 0.4rem;">A<sub>2</sub> (TBq) (Other Form)</th>
        <th style="padding: 0.4rem;">Activity concentration for exempt material (Bq/g)</th>
        <th style="padding: 0.4rem;">Activity limit for an exempt consignment (Bq)</th>
      </tr>
    </thead>
    <tbody>
      <tr style="background-color: #f2f2f2; height: 2rem">
        <td style="padding: 0.4rem;">Ac-225<sup>a</sup></td>
        <td style="padding: 0.4rem;">Actinium (89)</td>
        <td style="padding: 0.4rem;">0.8</td>
        <td style="padding: 0.4rem;">0.006</td>
        <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
      </tr>
      <tr style="height: 2rem">
        <td style="padding: 0.4rem;">Ac-227<sup>a</sup></td>
        <td style="padding: 0.4rem;"></td>
        <td style="padding: 0.4rem;">0.9</td>
        <td style="padding: 0.4rem;">0.00009</td>
        <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
      </tr>
      <tr style="background-color: #f2f2f2; height: 2rem">
        <td style="padding: 0.4rem;">Ac-228</td>
        <td style="padding: 0.4rem;"></td>
        <td style="padding: 0.4rem;">0.6</td>
        <td style="padding: 0.4rem;">0.5</td>
        <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
      </tr>
      <tr style="height: 2rem">
        <td style="padding: 0.4rem;">Ag-105</td>
        <td style="padding: 0.4rem;">Silver (47)</td>
        <td style="padding: 0.4rem;">2</td>
        <td style="padding: 0.4rem;">2</td>
        <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
      </tr>
      <tr style="background-color: #f2f2f2; height: 2rem">
        <td style="padding: 0.4rem;">Ag-108m</td>
        <td style="padding: 0.4rem;"></td>
        <td style="padding: 0.4rem;">0.7</td>
        <td style="padding: 0.4rem;">0.7</td>
        <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
      </tr>
      <tr style="height: 2rem">
        <td style="padding: 0.4rem;">Ag-110m</td>
        <td style="padding: 0.4rem;"></td>
        <td style="padding: 0.4rem;">0.4</td>
        <td style="padding: 0.4rem;">0.4</td>
        <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
      </tr>
      <tr style="background-color: #f2f2f2; height: 2rem">
    <td style="padding: 0.4rem;">Al-26</td>
    <td style="padding: 0.4rem;">Aluminum (13)</td>
    <td style="padding: 0.4rem;">0.1</td>
    <td style="padding: 0.4rem;">0.1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem">
    <td style="padding: 0.4rem;">Am-241</td>
    <td style="padding: 0.4rem;">Americium (95)</td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">0.001</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
  </tr>
  <tr style="background-color: #f2f2f2; height: 2rem">
    <td style="padding: 0.4rem;">Am-242m<sup>a</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">0.001</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0</sup><sup>b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup><sup>b</sup></td>
  </tr>
  <tr style="height: 2rem">
    <td style="padding: 0.4rem;">Am-243<sup>a</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">5</td>
    <td style="padding: 0.4rem;">0.001</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0</sup><sup>b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup><sup>b</sup></td>
  </tr>
  <tr style="background-color: #f2f2f2; height: 2rem">
    <td style="padding: 0.4rem;">Ar-37</td>
    <td style="padding: 0.4rem;">Argon (18)</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>8</sup></td>
  </tr>
  <tr style="height: 2rem">
    <td style="padding: 0.4rem;">Ar-39</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
  </tr>
  <tr style="background-color: #f2f2f2; height: 2rem">
    <td style="padding: 0.4rem;">Ar-41</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>9</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">As-72</td>
    <td style="padding: 0.4rem;">Arsenic (33)</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">As-73</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">As-74</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">0.9</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">As-76</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">As-77</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">At-211</td>
    <td style="padding: 0.4rem;">Astatine (85)</td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Au-193</td>
    <td style="padding: 0.4rem;">Gold (79)</td>
    <td style="padding: 0.4rem;">7</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Au-194</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Au-195</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Au-198</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Au-199</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Ba-131<sup>a</sup></td>
    <td style="padding: 0.4rem;">Barium (56)</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Ba-133</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Ba-133m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Ba-140<sup>a</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup><sup>b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup><sup>b</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Be-7</td>
    <td style="padding: 0.4rem;">Beryllium (4)</td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Be-10</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Bi-205</td>
    <td style="padding: 0.4rem;">Bismuth (83)</td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Bi-206</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Bi-207</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Bi-210</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Bi-210m<sup>a</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">0.02</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Bi-212<sup>a</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup><sup>b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup><sup>b</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Bk-247</td>
    <td style="padding: 0.4rem;">Berkelium (97)</td>
    <td style="padding: 0.4rem;">8</td>
    <td style="padding: 0.4rem;">0.0008</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Bk-249<sup>a</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Br-76</td>
    <td style="padding: 0.4rem;">Bromine (35)</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Br-77</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Br-82</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">C-11</td>
    <td style="padding: 0.4rem;">Carbon (6)</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">C-14</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Ca-41</td>
    <td style="padding: 0.4rem;">Calcium (20)</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Ca-45</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Ca-47<sup>a</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Cd-109</td>
    <td style="padding: 0.4rem;">Cadmium (48)</td>
    <td style="padding: 0.4rem;">30</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Cd-113m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Cd-115<sup>a</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Cd-115m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Ce-139</td>
    <td style="padding: 0.4rem;">Cerium (58)</td>
    <td style="padding: 0.4rem;">7</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Ce-141</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Ce-143</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.9</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Ce-144a</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.2</td>
    <td style="padding: 0.4rem;">0.2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup><sup>b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup><sup>b</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Cf-248</td>
    <td style="padding: 0.4rem;">Californium (98)</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.006</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Cf-249</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">0.0008</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Cf-250</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">0.002</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Cf-251</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">7</td>
    <td style="padding: 0.4rem;">0.0007</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Cf-252</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.1</td>
    <td style="padding: 0.4rem;">0.003</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Cf-253a</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.04</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Cf-254</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.001</td>
    <td style="padding: 0.4rem;">0.001</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Cl-36</td>
    <td style="padding: 0.4rem;">Chlorine (17)</td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Cl-38</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.2</td>
    <td style="padding: 0.4rem;">0.2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
   <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Cm-240</td>
    <td style="padding: 0.4rem;">Curium (96)</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.02</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Cm-241</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Cm-242</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.01</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Cm-243</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">9</td>
    <td style="padding: 0.4rem;">0.001</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Cm-244</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">0.002</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Cm-245</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">9</td>
    <td style="padding: 0.4rem;">0.0009</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Cm-246</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">9</td>
    <td style="padding: 0.4rem;">0.0009</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Cm-247a</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">0.001</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Cm-248</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.02</td>
    <td style="padding: 0.4rem;">0.0003</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Co-55</td>
    <td style="padding: 0.4rem;">Cobalt (27)</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Co-56</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Co-57</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Co-58m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Co-58</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Co-60</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Cr-51</td>
    <td style="padding: 0.4rem;">Chromium (24)</td>
    <td style="padding: 0.4rem;">30</td>
    <td style="padding: 0.4rem;">30</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Cs-129</td>
    <td style="padding: 0.4rem;">Cesium (55)</td>
    <td style="padding: 0.4rem;">4</td>
    <td style="padding: 0.4rem;">4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Cs-131</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">30</td>
    <td style="padding: 0.4rem;">30</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Cs-132</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Cs-134</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Cs-134m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Cs-135</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Cs-136</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Cs-137a</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup><sup>b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup><sup>b</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Cu-64</td>
    <td style="padding: 0.4rem;">Copper (29)</td>
    <td style="padding: 0.4rem;">6</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Cu-67</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Dy-159</td>
    <td style="padding: 0.4rem;">Dysprosium (66)</td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Dy-165</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.9</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Dy-166a</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.9</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Er-169</td>
    <td style="padding: 0.4rem;">Erbium (68)</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Er-171</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.8</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Eu-147</td>
    <td style="padding: 0.4rem;">Europium (63)</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Eu-148</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Eu-149</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Eu-150 (short lived)</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Eu-150 (long lived)</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Eu-152</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Eu-152m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.8</td>
    <td style="padding: 0.4rem;">0.8</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Eu-154</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.9</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Eu-155</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Eu-156</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">F-18</td>
    <td style="padding: 0.4rem;">Fluorine (9)</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Fe-52a</td>
    <td style="padding: 0.4rem;">Iron (26)</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Fe-55</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Fe-59</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.9</td>
    <td style="padding: 0.4rem;">0.9</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Fe-60a</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Ga-67</td>
    <td style="padding: 0.4rem;">Gallium (31)</td>
    <td style="padding: 0.4rem;">7</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Ga-68</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Ga-72</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Gd-146a</td>
    <td style="padding: 0.4rem;">Gadolinium (64)</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Gd-148</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">0.002</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Gd-153</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">9</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Gd-159</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Ge-68a</td>
    <td style="padding: 0.4rem;">Germanium (32)</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Ge-71</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>8</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Ge-77</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Hf-172a</td>
    <td style="padding: 0.4rem;">Hafnium (72)</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Hf-175</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Hf-181</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
   <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Hf-182</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Hg-194a</td>
    <td style="padding: 0.4rem;">Mercury (80)</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Hg-195ma</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Hg-197m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Hg-197</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Hg-203</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">5</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Ho-166</td>
    <td style="padding: 0.4rem;">Holmium (67)</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Ho-166m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">I-123</td>
    <td style="padding: 0.4rem;">Iodine (53)</td>
    <td style="padding: 0.4rem;">6</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">I-124</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">I-125</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">I-126</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">I-129</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">I-131</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">I-132</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">I-133</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">I-134</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">I-135a</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">In-111</td>
    <td style="padding: 0.4rem;">Indium (49)</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">In-113m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">4</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">In-114ma</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">In-115m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">7</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Ir-189a</td>
    <td style="padding: 0.4rem;">Iridium (77)</td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Ir-190</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Ir-192</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Ir-194</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">K-40</td>
    <td style="padding: 0.4rem;">Potassium (19)</td>
    <td style="padding: 0.4rem;">0.9</td>
    <td style="padding: 0.4rem;">0.9</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">K-42</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.2</td>
    <td style="padding: 0.4rem;">0.2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">K-43</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Kr-81</td>
    <td style="padding: 0.4rem;">Krypton (36)</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Kr-85m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">8</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>10</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Kr-85</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Kr-87</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.2</td>
    <td style="padding: 0.4rem;">0.2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>9</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">La-137</td>
    <td style="padding: 0.4rem;">Lanthanum (57)</td>
    <td style="padding: 0.4rem;">30</td>
    <td style="padding: 0.4rem;">6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">La-140</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">LSA</td>
    <td style="padding: 0.4rem;">Note 4</td>
    <td style="padding: 0.4rem;">Note 4</td>
    <td style="padding: 0.4rem;">Note 4</td>
    <td style="padding: 0.4rem;">Note 4</td>
    <td style="padding: 0.4rem;">Note 4</td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Lu-172</td>
    <td style="padding: 0.4rem;">Lutetium (71)</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Lu-173</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">8</td>
    <td style="padding: 0.4rem;">8</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Lu-174m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Lu-174</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">9</td>
    <td style="padding: 0.4rem;">9</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Lu-177</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">30</td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">MFP</td>
    <td style="padding: 0.4rem;">Mixed Fission Products</td>
    <td style="padding: 0.4rem;">Note 3</td>
    <td style="padding: 0.4rem;">Note 3</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;"></td>
  </tr>
    <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Mg-28<sup>a</sup></td>
    <td style="padding: 0.4rem;">Magnesium (12)</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Mn-52</td>
    <td style="padding: 0.4rem;">Manganese (25)</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Mn-53</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>9</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Mn-54</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Mn-56</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Mo-93</td>
    <td style="padding: 0.4rem;">Molybdenum (42)</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>8</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Mo-99a</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">N-13</td>
    <td style="padding: 0.4rem;">Nitrogen (7)</td>
    <td style="padding: 0.4rem;">0.9</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>9</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Na-22</td>
    <td style="padding: 0.4rem;">Sodium (11)</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Na-24</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.2</td>
    <td style="padding: 0.4rem;">0.2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Nb-93m</td>
    <td style="padding: 0.4rem;">Niobium (41)</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">30</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Nb-94</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Nb-95</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Nb-97</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.9</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Nd-147</td>
    <td style="padding: 0.4rem;">Neodymium (60)</td>
    <td style="padding: 0.4rem;">6</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Nd-149</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Ni-59</td>
    <td style="padding: 0.4rem;">Nickel (28)</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>8</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Ni-63</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">30</td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>8</sup></td>
  </tr>
  <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Ni-65</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Np-235</td>
    <td style="padding: 0.4rem;">Neptunium (93)</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
    <tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Np-236 (short lived)</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
  </tr>
  <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Np-236 (long lived)</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">9</td>
    <td style="padding: 0.4rem;">0.02</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
  </tr>
      <tr style="height: 2rem; background-color: #f2f2f2;">
        <td style="padding: 0.4rem;">Np-237</td>
        <td style="padding: 0.4rem;"></td>
        <td style="padding: 0.4rem;">20</td>
        <td style="padding: 0.4rem;">0.002</td>
        <td style="padding: 0.4rem;">1 x 10<sup>0b</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>3b</sup></td>
      </tr>
      <tr style="height: 2rem;">
        <td style="padding: 0.4rem;">Np-239</td>
        <td style="padding: 0.4rem;"></td>
        <td style="padding: 0.4rem;">7</td>
        <td style="padding: 0.4rem;">0.4</td>
        <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
      </tr>
      <tr style="height: 2rem; background-color: #f2f2f2;">
        <td style="padding: 0.4rem;">Os-185</td>
        <td style="padding: 0.4rem;">Osmium (76)</td>
        <td style="padding: 0.4rem;">1</td>
        <td style="padding: 0.4rem;">1</td>
        <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
      </tr>
      <tr style="height: 2rem;">
        <td style="padding: 0.4rem;">Os-191m</td>
        <td style="padding: 0.4rem;"></td>
        <td style="padding: 0.4rem;">40</td>
        <td style="padding: 0.4rem;">30</td>
        <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
      </tr>
      <tr style="height: 2rem; background-color: #f2f2f2;">
        <td style="padding: 0.4rem;">Os-191</td>
        <td style="padding: 0.4rem;"></td>
        <td style="padding: 0.4rem;">10</td>
        <td style="padding: 0.4rem;">2</td>
        <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
      </tr>
      <tr style="height: 2rem;">
        <td style="padding: 0.4rem;">Os-193</td>
        <td style="padding: 0.4rem;"></td>
        <td style="padding: 0.4rem;">2</td>
        <td style="padding: 0.4rem;">0.6</td>
        <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
      </tr>
      <tr style="height: 2rem; background-color: #f2f2f2;">
        <td style="padding: 0.4rem;">Os-194a</td>
        <td style="padding: 0.4rem;"></td>
        <td style="padding: 0.4rem;">0.3</td>
        <td style="padding: 0.4rem;">0.3</td>
        <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
      </tr>
      <tr style="height: 2rem;">
        <td style="padding: 0.4rem;">P-32</td>
        <td style="padding: 0.4rem;">Phosphorus (15)</td>
        <td style="padding: 0.4rem;">0.5</td>
        <td style="padding: 0.4rem;">0.5</td>
        <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
      </tr>
      <tr style="height: 2rem; background-color: #f2f2f2;">
        <td style="padding: 0.4rem;">P-33</td>
        <td style="padding: 0.4rem;"></td>
        <td style="padding: 0.4rem;">40</td>
        <td style="padding: 0.4rem;">1</td>
        <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>8</sup></td>
      </tr>
      <tr style="height: 2rem;">
        <td style="padding: 0.4rem;">Pa-230a</td>
        <td style="padding: 0.4rem;">Protactinium (91)</td>
        <td style="padding: 0.4rem;">2</td>
        <td style="padding: 0.4rem;">0.07</td>
        <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
      </tr>
      <tr style="height: 2rem; background-color: #f2f2f2;">
        <td style="padding: 0.4rem;">Pa-231</td>
        <td style="padding: 0.4rem;"></td>
        <td style="padding: 0.4rem;">4</td>
        <td style="padding: 0.4rem;">0.0004</td>
        <td style="padding: 0.4rem;">1 x 10<sup>0</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
      </tr>
      <tr style="height: 2rem;">
        <td style="padding: 0.4rem;">Pa-233</td>
        <td style="padding: 0.4rem;"></td>
        <td style="padding: 0.4rem;">5</td>
        <td style="padding: 0.4rem;">0.7</td>
        <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
      </tr>
      <tr style="height: 2rem; background-color: #f2f2f2;">
        <td style="padding: 0.4rem;">Pb-201</td>
        <td style="padding: 0.4rem;">Lead (82)</td>
        <td style="padding: 0.4rem;">1</td>
        <td style="padding: 0.4rem;">1</td>
        <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
      </tr>
      <tr style="height: 2rem;">
        <td style="padding: 0.4rem;">Pb-202</td>
        <td style="padding: 0.4rem;"></td>
        <td style="padding: 0.4rem;">40</td>
        <td style="padding: 0.4rem;">20</td>
        <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
      </tr>
      <tr style="height: 2rem; background-color: #f2f2f2;">
        <td style="padding: 0.4rem;">Pb-203</td>
        <td style="padding: 0.4rem;"></td>
        <td style="padding: 0.4rem;">4</td>
        <td style="padding: 0.4rem;">3</td>
        <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
      </tr>
      <tr style="height: 2rem;">
        <td style="padding: 0.4rem;">Pb-205</td>
        <td style="padding: 0.4rem;"></td>
        <td style="padding: 0.4rem;">Unlimited</td>
        <td style="padding: 0.4rem;">Unlimited</td>
        <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
      </tr>
      <tr style="height: 2rem; background-color: #f2f2f2;">
        <td style="padding: 0.4rem;">Pb-210<sup>a</sup></td>
        <td style="padding: 0.4rem;"></td>
        <td style="padding: 0.4rem;">1</td>
        <td style="padding: 0.4rem;">0.05</td>
        <td style="padding: 0.4rem;">1 x 10<sup>1b</sup></td>
        <td style="padding: 0.4rem;">1 x 10<sup>4b</sup></td>
      </tr>
      <tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Pb-212<sup>a</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">0.2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5b</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Pd-103</td>
    <td style="padding: 0.4rem;">Palladium (46)</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>8</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Pd-107</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>8</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Pd-109</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Pm-143</td>
    <td style="padding: 0.4rem;">Promethium (61)</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Pm-144</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Pm-145</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">30</td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Pm-147</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Pm-148m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.8</td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Pm-149</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Pm-151</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Po-210</td>
    <td style="padding: 0.4rem;">Polonium (84)</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.02</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Pr-142</td>
    <td style="padding: 0.4rem;">Praseodymium (59)</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Pr-143</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Pt-188</td>
    <td style="padding: 0.4rem;">Platinum (78)</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">0.8</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Pt-191</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">4</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Pt-193m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Pt-193</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Pt-195m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Pt-197m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Pt-197</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Pu-236</td>
    <td style="padding: 0.4rem;">Plutonium (94)</td>
    <td style="padding: 0.4rem;">30</td>
    <td style="padding: 0.4rem;">0.003</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Pu-237</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Pu-238</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">0.001</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Pu-239</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">0.001</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Pu-240</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">0.001</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Pu-241</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.06</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Pu-242</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">0.001</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Pu-244</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.001</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Ra-223</td>
    <td style="padding: 0.4rem;">Radium (88)</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.007</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5b</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Ra-224</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.02</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5b</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Ra-225</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.2</td>
    <td style="padding: 0.4rem;">0.004</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Ra-226</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.2</td>
    <td style="padding: 0.4rem;">0.003</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4b</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Ra-228</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">0.02</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5b</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Rb-81</td>
    <td style="padding: 0.4rem;">Rubidium (37)</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">0.8</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Rb-83</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Rb-84</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Rb-86</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Rb-87</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Rb (natural)</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Re-184</td>
    <td style="padding: 0.4rem;">Rhenium (75)</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Re-184m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Re-186</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Re-187</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>9</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Re-188</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Re-189</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Re (natural)</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>9</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Rh-99</td>
    <td style="padding: 0.4rem;">Rhodium (45)</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Rh-101</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">4</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Rh-102</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Rh-102m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Rh-103m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>8</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Rh-105</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">0.8</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Rn-222</td>
    <td style="padding: 0.4rem;">Radon (86)</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">0.004</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>8b</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Ru-97</td>
    <td style="padding: 0.4rem;">Ruthenium (44)</td>
    <td style="padding: 0.4rem;">5</td>
    <td style="padding: 0.4rem;">5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Ru-103</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Ru-105</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Ru-106</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.2</td>
    <td style="padding: 0.4rem;">0.2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5b</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">S-35</td>
    <td style="padding: 0.4rem;">Sulphur (16)</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>8</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Sb-122</td>
    <td style="padding: 0.4rem;">Antimony (51)</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Sb-124</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Sb-125</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Sb-126</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Sc-44</td>
    <td style="padding: 0.4rem;">Scandium (21)</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Sc-46</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Sc-47</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Sc-48</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">SCO</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">Note 5</td>
    <td style="padding: 0.4rem;">Note 5</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;"></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Se-75</td>
    <td style="padding: 0.4rem;">Selenium (34)</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Se-79</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Si-31</td>
    <td style="padding: 0.4rem;">Silicon (14)</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Si-32</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Sm-145</td>
    <td style="padding: 0.4rem;">Samarium (62)</td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Sm-147</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Sm-151</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>8</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Sm-153</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">9</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Sn-113</td>
    <td style="padding: 0.4rem;">Tin (50)</td>
    <td style="padding: 0.4rem;">4</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Sn-117m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">7</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Sn-119m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">30</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Sn-121m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.9</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Sn-123</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.8</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Sn-125</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Sn-126</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Sr-82</td>
    <td style="padding: 0.4rem;">Strontium (38)</td>
    <td style="padding: 0.4rem;">0.2</td>
    <td style="padding: 0.4rem;">0.2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Sr-85m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">5</td>
    <td style="padding: 0.4rem;">5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Sr-85</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Sr-87m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Sr-89</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Sr-90<sup>a</sup></td>
    <td style="padding: 0.4rem;"</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4b</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Sr-91<sup>a</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Sr-92<sup>a</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">T (All Forms)(see note)</td>
    <td style="padding: 0.4rem;">Tritium (1)</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>9</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Ta-178 (long lived)</td>
    <td style="padding: 0.4rem;">Tantalum (73)</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">0.8</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Ta-179</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">30</td>
    <td style="padding: 0.4rem;">30</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Ta-182</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.9</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Tb-157</td>
    <td style="padding: 0.4rem;">Terbium (65)</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Tb-158</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Tb-160</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Tc-95m</td>
    <td style="padding: 0.4rem;">Technetium (43)</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Tc-96m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Tc-96</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Tc-97m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Tc-97</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>8</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Tc-98</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.8</td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Tc-99m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Tc-99</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.9</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Te-121m</td>
    <td style="padding: 0.4rem;">Tellurium (52)</td>
    <td style="padding: 0.4rem;">5</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Te-121</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Te-123m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">8</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Te-125m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">0.9</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Te-127m<sup>a</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Te-127</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Te-129m<sup>a</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.8</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Te-129</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Te-131m<sup>a</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Te-132<sup>a</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Th-227</td>
    <td style="padding: 0.4rem;">Thorium (90)</td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">0.005</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Th-228<sup>a</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">0.001</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4b</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Th-229</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">5</td>
    <td style="padding: 0.4rem;">0.0005</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>3b</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Th-230</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">0.001</td>
    <td style="padding: 0.4rem;">1 x 10<sup>100</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Th-231</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.02</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Th-232</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">1 x 10<sup>101</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Th-234<sup>a</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5b</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Th (natural)</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>3b</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Ti-44<sup>a</sup></td>
    <td style="padding: 0.4rem;">Titanium (22)</td>
    <td style="padding: 0.4rem;">0.5</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Tl-200</td>
    <td style="padding: 0.4rem;">Thallium (81)</td>
    <td style="padding: 0.4rem;">0.9</td>
    <td style="padding: 0.4rem;">0.9</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Tl-201</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Tl-202</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Tl-204</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Tm-167</td>
    <td style="padding: 0.4rem;">Thulium (69)</td>
    <td style="padding: 0.4rem;">7</td>
    <td style="padding: 0.4rem;">0.8</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Tm-170</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Tm-171</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>8</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">U-230 (fast lung absorption)<sup>a, d</sup></td>
    <td style="padding: 0.4rem;">Uranium (92)</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5b</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">U-230 (medium lung absorption)<sup>a, e</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.004</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">U-230 (slow lung absorption)<sup>a, f</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">30</td>
    <td style="padding: 0.4rem;">0.003</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">U-232 (fast lung absorption)<sup>d</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.01</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>3b</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">U-232 (medium lung absorption)<sup>e</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.007</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">U-232 (slow lung absorption)<sup>f</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">0.001</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">U-233 (fast lung absorption)<sup>d</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.09</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">U-233 (medium lung absorption)<sup>e</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.02</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">U-233 (slow lung absorption)<sup>f</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.006</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">U-234 (fast lung absorption)<sup>d</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.09</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">U-234 (medium lung absorption)<sup>e, f</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.02</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">U-234 (slow lung absorption)<sup>f</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.006</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">U-235 (all lung absorption types)<sup>a, d, e, f</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4b</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">U-236 (fast lung absorption)<sup>d</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">U-236 (medium lung absorption)<sup>e</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.02</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">U-236 (slow lung absorption)<sup>f</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.006</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">U-238 (all lung absorption types)<sup>d, e, f</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4b</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">U (natural)</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>3b</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">U (enriched 20% or less)<sup>g</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">U (depleted)</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">1 x 10<sup>0</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">V-48</td>
    <td style="padding: 0.4rem;">Vanadium (23)</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">V-49</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">W-178</td>
    <td style="padding: 0.4rem;">Tungsten (74)</td>
    <td style="padding: 0.4rem;">9</td>
    <td style="padding: 0.4rem;">5</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">W-181</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">30</td>
    <td style="padding: 0.4rem;">30</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">W-185</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">0.8</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">W-187</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">W-188<sup>a</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Xe-122</td>
    <td style="padding: 0.4rem;">Xenon (54)</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>9</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Xe-123</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">0.7</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>9</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Xe-127</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">4</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Xe-131m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">40</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Xe-133</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">20</td>
    <td style="padding: 0.4rem;">10</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Xe-135</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>10</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Y-87</td>
    <td style="padding: 0.4rem;">Yttrium (39)</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Y-88</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Y-90</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Y-91m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Y-91</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Y-92</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.2</td>
    <td style="padding: 0.4rem;">0.2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Y-93</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">0.3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Yb-169</td>
    <td style="padding: 0.4rem;">Ytterbium (70)</td>
    <td style="padding: 0.4rem;">4</td>
    <td style="padding: 0.4rem;">1</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Yb-175</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">30</td>
    <td style="padding: 0.4rem;">0.9</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Zn-65</td>
    <td style="padding: 0.4rem;">Zinc (30)</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Zn-69m</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Zn-69</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">0.6</td>
    <td style="padding: 0.4rem;">1 x 10<sup>4</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Zr-88</td>
    <td style="padding: 0.4rem;">Zirconium (40)</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">3</td>
    <td style="padding: 0.4rem;">1 x 10<sup>2</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Zr-93</td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">Unlimited</td>
    <td style="padding: 0.4rem;">1 x 10<sup>3b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>7b</sup></td>
</tr>
<tr style="height: 2rem; background-color: #f2f2f2;">
    <td style="padding: 0.4rem;">Zr-95<sup>a</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">2</td>
    <td style="padding: 0.4rem;">0.8</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>6</sup></td>
</tr>
<tr style="height: 2rem;">
    <td style="padding: 0.4rem;">Zr-97<sup>1</sup></td>
    <td style="padding: 0.4rem;"></td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">0.4</td>
    <td style="padding: 0.4rem;">1 x 10<sup>1b</sup></td>
    <td style="padding: 0.4rem;">1 x 10<sup>5b</sup></td>
</tr>
    </tbody>
  </table>
  `,
};

export const TableA11Notes: DocumentNode = {
  id: "Table A.11.1. Notes",
  parentId: "A11.",
  bodyText: `
  <div style="border-bottom: 1px solid black; border-right: 1px solid black; border-left: 1px solid black; padding: 0.4rem">
  <ol>
    <li style="list-style-type: none;">
      <sup>a</sup> A<sub>1</sub> and/or A<sub>2</sub> values include contributions from daughter nuclides with half-lives less than 10 calendar days.
    </li>
    <li style="list-style-type: none;">
      <sup>b</sup> Parent nuclides and their progeny included in secular equilibrium are listed in the following:
    </li>
  </ol>
  <ul>
        <li>Sr-90 --- Y-90</li>
        <li>Zr-93 --- Nb-93m</li>
        <li>Zr-97 --- Nb-97</li>
        <li>Ru-106 --- Rh-106</li>
        <li>Cs-137 --- Ba-137m</li>
        <li>Ce-134 --- La-134</li>
        <li>Ce-144 --- Pr-144</li>
        <li>Ba-140 --- La-140</li>
        <li>Bi-212 --- Tl-208 (0.36), Po-212 (0.64)</li>
        <li>Pb-210 --- Bi-210, Po-210</li>
        <li>Pb-212 --- Bi-212, Tl-208 (0.36), Po-212 (0.64)</li>
        <li>Rn-220 --- Po-216</li>
        <li>Rn-222 --- Po-218, Pb-214, Bi-214, Po-214</li>
        <li>Ra-223 --- Rn-219, Po-215, Pb-211, Bi-211, Tl-207</li>
        <li>Ra-224 --- Rn-220, Po-216, Bi-212, Tl-208 (0.36), Po-212 (0.64)</li>
        <li>Ra-226 --- Rn-222, Po-218, Pb-214, Bi-214, Po-214, Pb-210, Bi-210, Po-210</li>
        <li>Ra-228 --- Ac-228</li>
        <li>Th-226 --- Ra-222, Rn-218, Po-214</li>
        <li>Th-228 --- Ra-224, Rn-220, Po-216, Pb-212, Bi-212, Tl-208 (0.36), Po-212 (0.64)</li>
        <li>Th-229 --- Ra-225, Ac-225, Fr-221, At-217, Bi-213, Po-213, Pb-209</li>
        <li>Th-nat --- Ra-228, Ac-228, Th-228, Ra-224, Rn-220, Po-216, Pb-212, Bi-212, Tl-208 (0.36), Po-212 (0.64)</li>
        <li>Th-234 --- Pa-234m</li>
        <li>U-230 --- Th-226, Ra-222, Rn-218, Po-214</li>
        <li>U-232 --- Th-228, Ra-224, Rn-220, Po-216, Pb-212, Bi-212, Tl-208 (0.36), Po-212 (0.64)</li>
        <li>U-235 --- Th-231</li>
        <li>U-238 --- Th-234, Pa-234m</li>
        <li>U-nat --- Th-234, Pa-234m, U-234, Th-230, Ra-226, Rn-222, Po-218, Pb-214, Bi-214, Po-214, Pb-210, Bi-210, Po-210</li>
        <li>U-240 --- Np-240m</li>
        <li>Np-237 --- Pa-233</li>
        <li>Am-242m --- Am-242</li>
        <li>Am-243 --- Np-239</li>
      </ul>
      <ol>
    <li style="list-style-type: none;">
      <sup>c</sup> The quantity may be determined from a measurement of the rate of decay or a measurement of the radiation level at a prescribed distance from the source.
    </li>
    <li style="list-style-type: none;">
      <sup>d</sup> These values apply only to compounds of uranium that take the chemical form of UF<sub>6</sub>, UO<sub>2</sub>F<sub>2</sub>, and UO<sub>2</sub>(NO<sub>3</sub>)<sub>2</sub> in both normal and accident conditions of transport.
    </li>

    <li style="list-style-type: none;">
      <sup>e</sup> These values apply only to compounds of uranium that take the chemical form of UO<sub>3</sub>, UF<sub>4</sub>, UCl<sub>4</sub>, and hexavalent compounds in both normal and accident conditions of transport.
    </li>
    <li style="list-style-type: none;">
      <sup>f</sup> These values apply to all compounds of uranium other than those specified in (d) and (e) above.
    </li>

    <li style="list-style-type: none;">
      <sup>g</sup> These values apply to unirradiated uranium only.
    </li>
  </ol>
  <ol>
    <li>In Table A11.1, the symbols for the various radionuclides are styled thus "Ir-192". The alternative form of "192 Ir" is equally acceptable.</li>
    <li>Tritium (T) is a synonym for the radionuclide Hydrogen-3.</li>
    <li>For Mixed Fission Products values for A<sub>1</sub> and A<sub>2</sub> are calculated using the formula for mixtures found in 49 CFR Paragraph 173.433(h).</li>
    <li>For Low Specific Activity (LSA) material, consult IATA, section 10.3.5.</li>
    <li>For Surface Contaminated Objects (SCO) consult IATA, section 10.3.6.</li>
    <li>Type A packages may not contain activities greater than the following values: for special form radioactive material: A<sub>1</sub>; or for all other radioactive materials: A<sub>2</sub>.</li>
  </ol>
  </div>
  `,
};

export const A11_5: DocumentNode = {
  id: "A11.5.",
  parentId: "A11.",
  title: "Excepted Packages.",
  bodyText:
    "An Excepted Package is a packaging used for containing radioactive material, that is designed to meet the general packaging requirements of A3.3.7. as applicable.",
  childNodeIds: [
    "A11.5.1.",
    "A11.5.2.",
    "A11.5.3.",
    "A11.5.4.",
    "A11.5.5.",
    "A11.5.6.",
    "A11.5.7.",
    "A11.5.8.",
  ],
};

export const A11_5_1: DocumentNode = {
  id: "A11.5.1.",
  parentId: "A11.5.",
  title: "General Requirements.",
  bodyText:
    "Radioactive materials in limited quantities, instruments, manufactured articles, and empty packagings may be transported as excepted packages, provided that:",
  childNodeIds: ["A11.5.1.1.", "A11.5.1.2."],
};

export const A11_5_1_1: DocumentNode = {
  id: "A11.5.1.1.",
  parentId: "A11.5.1.",
  bodyText:
    "The radiation level at any point on the external surface of the package is not over 5 µSv/h (0.5 mrem/h).",
};

export const A11_5_1_2: DocumentNode = {
  id: "A11.5.1.2.",
  parentId: "A11.5.1.",
  bodyText:
    "The nonfixed (removable) radioactive surface contamination on the external surface of the package is not over the limits specified in A3.3.7.6.",
};

export const A11_5_2: DocumentNode = {
  id: "A11.5.2.",
  parentId: "A11.5.",
  title: "Exceptions.",
  childNodeIds: ["A11.5.2.1.", "A11.5.2.2."],
};

export const A11_5_2_1: DocumentNode = {
  id: "A11.5.2.1.",
  parentId: "A11.5.2.",
  bodyText: "Excepted packages are subject to the following:",
  childNodeIds: ["A11.5.2.1.1.", "A11.5.2.1.2.", "A11.5.2.1.3."],
};

export const A11_5_2_1_1: DocumentNode = {
  id: "A11.5.2.1.1.",
  parentId: "A11.5.2.1.",
  bodyText: "Package marking requirements in A14.4.6.2.",
};

export const A11_5_2_1_2: DocumentNode = {
  id: "A11.5.2.1.2.",
  parentId: "A11.5.2.1.",
  bodyText: "Reporting accidents/incidents.",
};

export const A11_5_2_1_3: DocumentNode = {
  id: "A11.5.2.1.3.",
  parentId: "A11.5.2.1.",
  bodyText:
    "The materials are packaged in strong, tight packages that will not leak any of the radioactive materials under normal transportation conditions. Ensure packaging meets the general requirements of A3.3.7.8.",
};

export const A11_5_2_2: DocumentNode = {
  id: "A11.5.2.2.",
  parentId: "A11.5.2.",
  bodyText: "Excepted packages are not subject to the following:",
  childNodeIds: ["A11.5.2.2.1.", "A11.5.2.2.2.", "A11.5.2.2.3."],
};

export const A11_5_2_2_1: DocumentNode = {
  id: "A11.5.2.2.1.",
  parentId: "A11.5.2.2.",
  bodyText: "Specification Packaging.",
};

export const A11_5_2_2_2: DocumentNode = {
  id: "A11.5.2.2.2.",
  parentId: "A11.5.2.2.",
  bodyText: "Marking requirements (except A14.4.6.2.).",
};

export const A11_5_2_2_3: DocumentNode = {
  id: "A11.5.2.2.3.",
  parentId: "A11.5.2.2.",
  bodyText: "Shipper's Declaration for Dangerous Goods requirements.",
};

export const A11_5_3: DocumentNode = {
  id: "A11.5.3.",
  parentId: "A11.5.",
  title: "Other Hazards.",
  bodyText:
    "For excepted packages of radioactive materials possessing any other dangerous characteristics, the other hazard takes precedence. Package as required by this manual relevant to the other hazard.",
};

export const A11_5_4: DocumentNode = {
  id: "A11.5.4.",
  parentId: "A11.5.",
  title: "Radioactive Materials in Limited Quantities.",
  bodyText:
    "Radioactive material whose activities do not exceed the relevant exception limits listed in the column headed “Materials - Package Limits” in Table A11.2. may be transported in an excepted package, provided that:",
  childNodeIds: ["A11.5.4.1.", "A11.5.4.2."],
};

export const A11_5_4_1: DocumentNode = {
  id: "A11.5.4.1.",
  parentId: "A11.5.4.",
  bodyText:
    "These materials are packaged in such a manner that, in conditions likely to be encountered during routine transport (incident-free conditions), there can be no leakage of radioactive material from the package.",
};

export const A11_5_4_2: DocumentNode = {
  id: "A11.5.4.2.",
  parentId: "A11.5.4.",
  bodyText:
    "The package bears the marking “RADIOACTIVE” on an internal surface in such a manner that a warning of the presence of radioactive material is visible on opening the package.",
};

export const A11_5_5: DocumentNode = {
  id: "A11.5.5.",
  parentId: "A11.5.",
  title: "Instruments and Manufactured Articles.",
  bodyText:
    "Instruments and manufactured articles (including clocks, electronic tubes, or apparatus) or similar devices having radioactive materials in gaseous or nondispersible solid form as a component part may be transported in an excepted package if:",
  childNodeIds: [
    "A11.5.5.1.",
    "A11.5.5.2.",
    "A11.5.5.3.",
    "A11.5.5.4.",
    "A11.5.5.5.",
    "A11.5.5.6.",
    "A11.5.5.7.",
    "Table A11.2.",
  ],
};

export const A11_5_5_1: DocumentNode = {
  id: "A11.5.5.1.",
  parentId: "A11.5.5.",
  bodyText: "Each package meets the general requirements of A3.3.7.8.",
};

export const A11_5_5_2: DocumentNode = {
  id: "A11.5.5.2.",
  parentId: "A11.5.5.",
  bodyText:
    "The activity of the instrument or article is not over the applicable limit listed in Table A11.2.",
};

export const A11_5_5_3: DocumentNode = {
  id: "A11.5.5.3.",
  parentId: "A11.5.5.",
  bodyText:
    "The total activity per package is not over the applicable limit listed in Table A11.2.",
};

export const A11_5_5_4: DocumentNode = {
  id: "A11.5.5.4.",
  parentId: "A11.5.5.",
  bodyText:
    "The active material is completely enclosed by a nonactive component.",
};

export const A11_5_5_5: DocumentNode = {
  id: "A11.5.5.5.",
  parentId: "A11.5.5.",
  bodyText:
    "The radiation level at 10 cm (4 inches) from any point on the external surface of any unpackaged instrument or article is not over 0.1 mSv/h (10 mrem/h). The radiation level at any point on the external surface of a package bearing the article or instrument does not exceed 0.005 mSv/hour (0.5 mrem/hour), or, for exclusive use domestic shipments, 0.02 mSv/hour (2 mrem/hour).",
};

export const A11_5_5_6: DocumentNode = {
  id: "A11.5.5.6.",
  parentId: "A11.5.5.",
  bodyText: "Each instrument or article is marked “RADIOACTIVE” except:",
  childNodeIds: ["A11.5.5.6.1.", "A11.5.5.6.2."],
};

export const A11_5_5_6_1: DocumentNode = {
  id: "A11.5.5.6.1.",
  parentId: "A11.5.5.6.",
  bodyText:
    "Radioluminescent time-pieces or devices. Note: Some radioluminescent devices require marking as radioactive 10 CFR.",
};

export const A11_5_5_6_2: DocumentNode = {
  id: "A11.5.5.6.2.",
  parentId: "A11.5.5.6.",
  bodyText:
    "Consumer products that either have received regulatory approval, following their sale to the end user or do not individually exceed the activity limit for an exempt consignment in Table A11.1. provided such products are transported in a package that bears the marking “RADIOACTIVE” on an internal surface in such a manner that warning of the presence of radioactive material is visible upon opening the package.",
};

export const A11_5_5_7: DocumentNode = {
  id: "A11.5.5.7.",
  parentId: "A11.5.5.",
  bodyText:
    "The active material is completely enclosed by non-active components (a device performing the sole function of containing radioactive material may not be considered to be an instrument or manufactured article).",
};

export const TableA11_2: DocumentNode = {
  id: "Table A11.2.",
  parentId: "A11.5.5.",
  title: " Activity Limits for Limited Quantities Instruments and Articles",
  bodyText: `
  <div style="border: 1px solid black; padding: 0.4rem">
  <table border="1" style="border-collapse: collapse; width: 90%; margin: 20px 0;">
    <thead>
      <tr style="height: 2rem;">
        <th style="padding: 0.4rem;">Nature of Contents</th>
        <th style="padding: 0.4rem;">Materials <br> Package Limits (Note 1)</th>
        <th style="padding: 0.4rem;">Instruments and Articles <br> Limits for each instrument and article (Note 1)</th>
        <th style="padding: 0.4rem;">Instruments and Articles <br> Package Limits (Note 1)</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 2rem;">
        <td style="padding: 0.4rem;"><strong>Solids </strong><br> Special Form <br> Other Form</td>
        <td style="padding: 0.4rem;">10<sup>-3</sup> A<sub>1</sub> <br> 10<sup>-3</sup> A<sub>2</sub></td>
        <td style="padding: 0.4rem;">10<sup>-2</sup> A<sub>1</sub> <br> 10<sup>-2</sup> A<sub>2</sub></td>
        <td style="padding: 0.4rem;">A<sub>1</sub> <br> A<sub>2</sub></td>
      </tr>
      <tr style="height: 2rem; background-color: #f2f2f2;">
        <td style="padding: 0.4rem;"><strong>Liquids</strong> <br> Tritiated Water: <br> &lt;0.0037 TBq/liter (0.1 Ci/L) <br> 0.0037 TBq to 0.037 TBq/L (0.1 Ci to 1.0 Ci/L) <br> &gt;0.037 TBq/L (1.0 Ci/L) <br> Other Liquids</td>
        <td style="padding: 0.4rem;">37 TBq (1000 Ci) <br> 3.7 TBq (100 Ci) <br> 0.037 TBq (1 Ci) <br> 10<sup>-4</sup> A<sub>2</sub></td>
        <td style="padding: 0.4rem;">10<sup>-3</sup> A<sub>2</sub></td>
        <td style="padding: 0.4rem;">10<sup>-1</sup> A<sub>2</sub></td>
      </tr>
      <tr style="height: 2rem;">
        <td style="padding: 0.4rem;"><strong>Gases</strong> <br> Tritium (Note 2) <br> Special Form <br> Other Forms</td>
        <td style="padding: 0.4rem;">2 x 10<sup>-2</sup> A<sub>2</sub> <br> 10<sup>-3</sup> A<sub>1</sub> <br> 10<sup>-3</sup> A<sub>2</sub></td>
        <td style="padding: 0.4rem;">2 x 10<sup>-2</sup> A<sub>2</sub></td>
        <td style="padding: 0.4rem;">2 x 10<sup>-1</sup> A<sub>1</sub> <br> 10<sup>-2</sup> A<sub>2</sub></td>
      </tr>
    </tbody>
  </table>
  <p><strong>Notes:</strong></p>
  <ol>
    <li>For mixture of radionuclides see 49 CFR Paragraph 173.433(d).</li>
    <li>These values also apply to tritium in activated luminous paint and tritium absorbed on solid carriers.</li>
  </ol>
  </div>
  `,
};

export const A11_5_6: DocumentNode = {
  id: "A11.5.6.",
  parentId: "A11.5.",
  title:
    "Articles Manufactured from Natural Uranium, Depleted Uranium, or Natural Thorium.",
  bodyText: `Manufactured articles, in which the sole radioactive material is unirradiated natural uranium, unirradiated depleted uranium, or unirradiated natural thorium, may be transported as an excepted package, provided that the outer surface of the uranium or thorium is enclosed in an inactive sheath made of metal or some other substantial material.`,
};

export const A11_5_7: DocumentNode = {
  id: "A11.5.7.",
  parentId: "A11.5.",
  title: "Empty Packages.",
  bodyText: `An empty packaging which had previously contained radioactive material may be transported as an excepted package if the following conditions are met:`,
  childNodeIds: [
    "A11.5.7.1.",
    "A11.5.7.2.",
    "A11.5.7.3.",
    "A11.5.7.4.",
    "A11.5.7.5.",
  ],
};

export const A11_5_7_1: DocumentNode = {
  id: "A11.5.7.1.",
  parentId: "A11.5.7.",
  bodyText: `It is in a well-maintained condition and securely closed.`,
};

export const A11_5_7_2: DocumentNode = {
  id: "A11.5.7.2.",
  parentId: "A11.5.7.",
  bodyText: `The outer surface of any uranium or thorium in its structure is covered with an active sheath made of metal or some other substantial material.`,
};

export const A11_5_7_3: DocumentNode = {
  id: "A11.5.7.3.",
  parentId: "A11.5.7.",
  bodyText: `The level of internal non-fixed contamination does not exceed one hundred times the levels specified in A3.3.7.6. for an excepted package.`,
};

export const A11_5_7_4: DocumentNode = {
  id: "A11.5.7.4.",
  parentId: "A11.5.7.",
  bodyText: `Hazardous materials labels used on the package previously are removed or no longer visible.`,
};

export const A11_5_7_5: DocumentNode = {
  id: "A11.5.7.5.",
  parentId: "A11.5.7.",
  bodyText: `The 'Empty' label is applied to the package.`,
};

export const A11_5_8: DocumentNode = {
  id: "A11.5.8.",
  parentId: "A11.5.",
  title: "Activity Limit Per Package.",
  childNodeIds: ["A11.5.8.1.", "A11.5.8.2."],
};

export const A11_5_8_1: DocumentNode = {
  id: "A11.5.8.1.",
  parentId: "A11.5.8.",
  title: "Excepted Package of Radioactive Material.",
  bodyText: `For radioactive material other than articles manufactured of natural uranium, or natural thorium, an excepted package may not contain activities greater than the following:`,
  childNodeIds: ["A11.5.8.1.1.", "A11.5.8.1.2."],
};

export const A11_5_8_1_1: DocumentNode = {
  id: "A11.5.8.1.1.",
  parentId: "A11.5.8.1.",
  bodyText: `Where the radioactive material is enclosed in, or forms a component part of an instrument or other manufactured article, such as a clock or electronic apparatus, the limits specified in A11.5.5. for each individual item and each package respectively.`,
};

export const A11_5_8_1_2: DocumentNode = {
  id: "A11.5.8.1.2.",
  parentId: "A11.5.8.1.",
  bodyText: `Where the radioactive material is not so enclosed in or is not included as a component of an instrument or other manufactured article, the limits specified in A11.5.4.`,
};

export const A11_5_8_2: DocumentNode = {
  id: "A11.5.8.2.",
  parentId: "A11.5.8.",
  title: "Manufactured Articles.",
  bodyText: `For articles manufactured of natural uranium, depleted uranium, or natural thorium, an excepted package may contain any quantity of such material provided that the outer surface of the uranium or thorium is enclosed in an inactive sheath made of metal or some other substantial material.`,
};

export const A11_6: DocumentNode = {
  id: "A11.6.",
  parentId: "A11.",
  title: "Industrial Packaging.",
  bodyText:
    "Industrial Packaging may be used for Low Specific Activity (LSA) material and Surface Contaminated Objects (SCO). LSA and SCO materials may not be transported unpackaged.",
  childNodeIds: [
    "A11.6.1.",
    "Table A11.3.",
    "A11.6.2.",
    "A11.6.3.",
    "A11.6.4.",
    "A11.6.5.",
    "A11.6.6.",
    "A11.6.7.",
    "A11.6.8.",
    "Table A11.4.",
  ],
};

export const A11_6_1: DocumentNode = {
  id: "A11.6.1.",
  parentId: "A11.6.",
  title: "Activity Limit.",
  bodyText:
    "The total activity in a single package of LSA material or in a single package of SCO must be so restricted that the radiation level specified in A11.6.5. is not exceeded, and the activity in a single package must also be so restricted that the activity limits for an aircraft specified in Table A11.3 are not exceeded. A single package of non-combustible solid LSA-II or LSA-III material shall not contain an activity greater than 3,000 A<sub>2</sub>. <strong>(T-0)</strong>.",
};

export const TableA11_3: DocumentNode = {
  id: "Table A11.3.",
  parentId: "A11.6.",
  title:
    " Aircraft Activity Limits for LSA Material and SCO in Industrial Packages",
  bodyText: `
  <table border="1" style="border-collapse: collapse; width: 90%; margin: 20px 0;">
    <thead>
      <tr style="height: 2rem;">
        <th style="padding: 0.4rem;">Nature of Material</th>
        <th style="padding: 0.4rem;">Activity Limit Per Aircraft</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 2rem;">
        <td style="padding: 0.4rem;">LSA-I</td>
        <td style="padding: 0.4rem;">No Limit</td>
      </tr>
      <tr style="height: 2rem; background-color: #f2f2f2;">
        <td style="padding: 0.4rem;">LSA-II and LSA-III non-combustible solids</td>
        <td style="padding: 0.4rem;">No Limit</td>
      </tr>
      <tr style="height: 2rem;">
        <td style="padding: 0.4rem;">LSA-II and LSA-III combustible solids, and all liquids and gases</td>
        <td style="padding: 0.4rem;">100 A<sub>2</sub></td>
      </tr>
      <tr style="height: 2rem; background-color: #f2f2f2;">
        <td style="padding: 0.4rem;">SCO</td>
        <td style="padding: 0.4rem;">100 A<sub>2</sub></td>
      </tr>
    </tbody>
  </table>
  `,
};

export const A11_6_2: DocumentNode = {
  id: "A11.6.2.",
  parentId: "A11.6.",
  title: "Industrial Package Type 1.",
  bodyText:
    "A packaging or freight container containing LSA material or SCO that is designed to meet the requirements of 49 CFR Section 173.411 is an Industrial Package Type 1 (Type IP-1).",
};

export const A11_6_3: DocumentNode = {
  id: "A11.6.3.",
  parentId: "A11.6.",
  title: "Industrial Package Type 2.",
  bodyText:
    "A packaging or freight container containing LSA material or SCO that is designed to meet the requirements of 49 CFR Section 173.411 is an Industrial Package Type 2 (Type IP-2).",
};

export const A11_6_4: DocumentNode = {
  id: "A11.6.4.",
  parentId: "A11.6.",
  title: "Industrial Package Type 3.",
  bodyText:
    "A packaging or freight container containing LSA material or SCO that is designed to meet the requirements of 49 CFR Section 173.411 is an Industrial Package Type 3 (Type IP-3).",
};

export const A11_6_5: DocumentNode = {
  id: "A11.6.5.",
  parentId: "A11.6.",
  title: "LSA and SCO Quantity Limit.",
  bodyText:
    "The quantity of LSA material or SCO in a single Industrial Package Type 1, Industrial Package Type 2, or Industrial Package Type 3 must be so restricted that the external radiation level at 3m (10 ft) from the unshielded material does not exceed 10 mSv/h (1 rem/h). <strong>(T-0)</strong>.",
};

export const A11_6_6: DocumentNode = {
  id: "A11.6.6.",
  parentId: "A11.6.",
  title: "LSA and SCO - Fissile.",
  bodyText:
    "LSA material and SCO which is, or contains, fissile material, must meet the applicable requirements of either 49 CFR Section 173.457 or 10 CFR Part 71. <strong>(T-0)</strong>.",
};

export const A11_6_7: DocumentNode = {
  id: "A11.6.7.",
  parentId: "A11.6.",
  title: "LSA and SCO - Restrictions.",
  bodyText:
    "Packages and Freight containers containing LSA material or SCO must meet the requirements of A3.3.7.6. and A3.3.7.18. LSA material in group LSA-I and SCO in group SCO-I must not be transported unpackaged. <strong>(T-0)</strong>.",
};

export const A11_6_8: DocumentNode = {
  id: "A11.6.8.",
  parentId: "A11.6.",
  title: "LSA and SCO - Integrity Limits.",
  bodyText:
    "LSA material and SCO must be packaged in accordance with Table A11.4. <strong>(T-0)</strong>.",
};

export const TableA11_4: DocumentNode = {
  id: "Table A11.4.",
  parentId: "A11.6.",
  title: " Industrial Package Integrity Requirements for LSA and SCO",
  bodyText: `
  <table border="1" style="border-collapse: collapse; width: 90%; margin: 20px 0;">
    <thead>
      <tr style="height: 2rem;">
        <th style="padding: 0.4rem;" rowspan="2">Contents</th>
        <th style="padding: 0.4rem;" colspan="2">Industrial Package Type</th>
      </tr>
      <tr style="height: 2rem;">
        <th style="padding: 0.4rem;">Exclusive Use</th>
        <th style="padding: 0.4rem;">NOT Under Exclusive Use</th>
      </tr>
    </thead>
   <tbody>
      <tr style="height: 2rem;">
        <td style="padding: 0.4rem;" rowspan="2">LSA-I</td>
        <td style="padding: 0.4rem;">Type 1 (Solid)</td>
        <td style="padding: 0.4rem;">Type 1 (Solid)</td>
      </tr>
      <tr style="height: 2rem; background-color: #f2f2f2;">
        <td style="padding: 0.4rem;">Type 1 (Liquid)</td>
        <td style="padding: 0.4rem;">Type 2 (Liquid)</td>
      </tr>
      <tr style="height: 2rem;">
        <td style="padding: 0.4rem;" rowspan="2">LSA-II</td>
        <td style="padding: 0.4rem;">Type 2 (Solid)</td>
        <td style="padding: 0.4rem;">Type 2 (Solid)</td>
      </tr>
      <tr style="height: 2rem; background-color: #f2f2f2;">
        <td style="padding: 0.4rem;">Type 2 (Liquid and gas)</td>
        <td style="padding: 0.4rem;">Type 3 (Liquid and gas)</td>
      </tr>
      <tr style="height: 2rem;">
        <td style="padding: 0.4rem;">LSA-III</td>
        <td style="padding: 0.4rem;">Type 2</td>
        <td style="padding: 0.4rem;">Type 3</td>
      </tr>
      <tr style="height: 2rem; background-color: #f2f2f2;">
        <td style="padding: 0.4rem;">SCO-I</td>
        <td style="padding: 0.4rem;">Type 1</td>
        <td style="padding: 0.4rem;">Type 1</td>
      </tr>
      <tr style="height: 2rem;">
        <td style="padding: 0.4rem;">SCO-II</td>
        <td style="padding: 0.4rem;">Type 2</td>
        <td style="padding: 0.4rem;">Type 2</td>
      </tr>
    </tbody>
  </table>
  `,
};

export const A11_7: DocumentNode = {
  id: "A11.7.",
  parentId: "A11.",
  title:
    "Packages Containing Uranium Hexafluoride (fissile, fissile excepted, and nonfissile).",
  bodyText:
    "The mass of uranium hexafluoride in a package shall not have a value that would lead to a ullage smaller than 5% at the maximum temperature of the package as specified for the plant systems where the package is used. <strong>(T-0)</strong>. The uranium hexafluoride shall be in solid form and the internal pressure of the package shall be below atmospheric pressure when presented for transport. <strong>(T-0)</strong>. Prepare this material for military air shipment according to 49 CFR Section 173.420.",
};

export const A11_8: DocumentNode = {
  id: "A11.8.",
  parentId: "A11.",
  title: "Authorized Type A Packages.",
  bodyText:
    "Use the following packages for shipment, if they do not contain quantities over A<sub>1</sub> or A<sub>2</sub> as appropriate:",
  childNodeIds: ["A11.8.1.", "A11.8.2.", "A11.8.3.", "A11.8.4.", "A11.8.5."],
};

export const A11_8_1: DocumentNode = {
  id: "A11.8.1.",
  parentId: "A11.8.",
  title: "DOT 7A packaging.",
  bodyText:
    "DOT 7A packaging designed according to the requirements of 49 CFR Section 178.350 in effect after 30 June 1983.",
};

export const A11_8_2: DocumentNode = {
  id: "A11.8.2.",
  parentId: "A11.8.",
  bodyText: "Any Type A packaging authorized in 49 CFR Section 173.415.",
};

export const A11_8_3: DocumentNode = {
  id: "A11.8.3.",
  parentId: "A11.8.",
  bodyText:
    "Any Type A packaging that meets the applicable standards for fissile materials in 10 CFR Part 71 and authorized in 49 CFR Section 173.471.",
};

export const A11_8_4: DocumentNode = {
  id: "A11.8.4.",
  parentId: "A11.8.",
  bodyText:
    "Any Type B, B(U), or B(M) packaging, authorized in A11.9.2.1. or A11.9.2.2.",
};

export const A11_8_5: DocumentNode = {
  id: "A11.8.5.",
  parentId: "A11.8.",
  title: "Foreign-Made Packaging.",
  bodyText: `Any foreign-made packaging that meets the standards of IAEA <i>”Regulations for the Safe Transport of Radioactive Materials, No. TS-R-1”</i> and bears the marking "Type A" used for the import of radioactive materials. The packaging must conform to the requirements of the country of origin (as indicated by the packaging marking) and the IAEA regulations applicable to Type A packaging. <strong>(T-0)</strong>.`,
};

export const A11_9: DocumentNode = {
  id: "A11.9.",
  parentId: "A11.",
  title: "Type B Packages.",
  childNodeIds: ["A11.9.1.", "A11.9.2."],
};

export const A11_9_1: DocumentNode = {
  id: "A11.9.1.",
  parentId: "A11.9.",
  title: "Activity Limits.",
  bodyText:
    "Type B(U) and B(M) may not contain activities greater than the following:",
  childNodeIds: ["A11.9.1.1.", "A11.9.1.2.", "A11.9.1.3."],
};

export const A11_9_1_1: DocumentNode = {
  id: "A11.9.1.1.",
  parentId: "A11.9.1.",
  bodyText: "Low dispersible material - as authorized for the package design.",
};

export const A11_9_1_2: DocumentNode = {
  id: "A11.9.1.2.",
  parentId: "A11.9.1.",
  bodyText:
    "Special Form Radioactive Material - 3,000 A<sub>1</sub> or 100,000 A<sub>2</sub>, whichever is lower.",
};

export const A11_9_1_3: DocumentNode = {
  id: "A11.9.1.3.",
  parentId: "A11.9.1.",
  bodyText: "All other radioactive material - 3,000 A<sub>2</sub>.",
};

export const A11_9_2: DocumentNode = {
  id: "A11.9.2.",
  parentId: "A11.9.",
  title: "Authorized Packages.",
  bodyText:
    "Use the following packages for shipment of quantities over A<sub>1</sub> or A<sub>2</sub>, as appropriate:",
  childNodeIds: ["A11.9.2.1.", "A11.9.2.2."],
};

export const A11_9_2_1: DocumentNode = {
  id: "A11.9.2.1.",
  parentId: "A11.9.2.",
  bodyText:
    "Any Type B, Type B(U), or Type B(M) packaging that meets the applicable requirements in 10 CFR Part 71 and has been approved by the US Nuclear Regulatory Commission may be shipped per 49 CFR Section 173.471.",
};

export const A11_9_2_2: DocumentNode = {
  id: "A11.9.2.2.",
  parentId: "A11.9.2.",
  bodyText:
    "Any Type B, B(U) or B(M) packaging that meets the applicable requirements of the regulations of the IAEA 'Regulations for the Safe Transport of Radioactive Materials, No. TS-R-1' and for which the foreign competent authority certificate has been revalidated by DOT according to 49 CFR Section 173.473. Authorized only for export and import shipments.",
};

export const A11_10: DocumentNode = {
  id: "A11.10.",
  parentId: "A11.",
  title: "Authorized Packaging-Fissile Materials.",
  childNodeIds: ["A11.10.1.", "A11.10.2."],
};

export const A11_10_1: DocumentNode = {
  id: "A11.10.1.",
  parentId: "A11.10.",
  bodyText:
    "Except as provided in A3.3.7.3.4.1., package fissile materials containing not more than A<sub>1</sub> or A<sub>2</sub> (as appropriate) in:",
  childNodeIds: [
    "A11.10.1.1.",
    "A11.10.1.2.",
    "A11.10.1.3.",
    "A11.10.1.4.",
    "A11.10.1.5.",
  ],
};

export const A11_10_1_1: DocumentNode = {
  id: "A11.10.1.1.",
  parentId: "A11.10.1.",
  bodyText:
    "Any packaging listed in A11.8., limited to radioactive materials specified in 10 CFR Part 71, Subpart C.",
};

export const A11_10_1_2: DocumentNode = {
  id: "A11.10.1.2.",
  parentId: "A11.10.1.",
  bodyText:
    "Any other Type AF, Type BF, Type B(U)F, or Type B(M)F packaging for fissile radioactive materials that also meets the applicable standards for fissile materials in 10 CFR Part 71.",
};

export const A11_10_1_3: DocumentNode = {
  id: "A11.10.1.3.",
  parentId: "A11.10.1.",
  bodyText:
    "Any other Type AF, Type B(U)F, or Type B(M)F packaging that also meets the applicable requirements for fissile material packaging in section VI of the IAEA <i>”Regulations for the Safe Transport of Radioactive Materials, No. TS-R-1”</i> and for which the foreign competent authority certificate has been revalidated by the DOT according to 49 CFR Section 173.473. Authorized only for export and import shipments.",
};

export const A11_10_1_4: DocumentNode = {
  id: "A11.10.1.4.",
  parentId: "A11.10.1.",
  bodyText: `Any metal cylinder that meets the performance requirements of A11.5. and 49 CFR Section 178.350 for DOT 7A Type A packaging may be used for the transport of residual "heels" of enriched solid uranium hexafluoride without a protective overpack per Table A11.5.`,
};

export const A11_10_1_5: DocumentNode = {
  id: "A11.10.1.5.",
  parentId: "A11.10.1.",
  bodyText:
    "DOT 20PF-1, 20PF-2, 20PF-3 or 21PF-1A, 21PF-1B, or 21PF-2 phenolic-foam insulated overpacks with snug fitting inner metal cylinders meeting all of the applicable requirements of A3.3.7.9., A3.3.7.10., and the following:",
  childNodeIds: ["A11.10.1.5.1.", "A11.10.1.5.2.", "Table A11.5."],
};

export const A11_10_1_5_1: DocumentNode = {
  id: "A11.10.1.5.1.",
  parentId: "A11.10.1.5.",
  bodyText:
    "Handling procedures and packaging criteria complying with US Enrichment Corporation Report Number USEC-651 or ANSI N14.1 is required.",
};

export const A11_10_1_5_2: DocumentNode = {
  id: "A11.10.1.5.2.",
  parentId: "A11.10.1.5.",
  bodyText:
    "Quantities of uranium hexafluoride are authorized as shown in Table A11.6., with each package assigned a minimum transport index as also shown.",
};

export const TableA11_5: DocumentNode = {
  id: "Table A11.5.",
  parentId: "A11.10.1.5.",
  title: ` Allowable Content of Uranium Hexafluoride (UF6) "Heels" in a Specification 7A Cylinder.`,
  bodyText: `
  <table border="1" style="border-collapse: collapse; width: 100%; margin: 20px 0px 20px 0px">
    <thead>
      <tr style="height: 2rem;">
        <th style="padding: 0.4rem;" colspan="2">Maximum Cylinder Diameter</th>
        <th style="padding: 0.4rem;" colspan="2">Cylinder Volume</th>
        <th style="padding: 0.4rem;">Maximum Uranium 235 Enrichment (Weight %)</th>
        <th style="padding: 0.4rem;" colspan="4">Maximum "Heel" Weight Per Cylinder</th>
      </tr>
      <tr style="height: 2rem;">
        <th style="padding: 0.4rem;">Inches</th>
        <th style="padding: 0.4rem;">Centimeters</th>
        <th style="padding: 0.4rem;">Cubic Feet</th>
        <th style="padding: 0.4rem;">L</th>
         <th style="padding: 0.4rem;"></th>
        <th style="padding: 0.4rem;">kg</th>
        <th style="padding: 0.4rem;">(lb)</th>
        <th style="padding: 0.4rem;">kg</th>
        <th style="padding: 0.4rem;">(lb)</th>
      </tr>
    </thead>
    <tbody>
      <tr style="height: 2rem;">
        <td style="padding: 0.4rem;">5</td>
        <td style="padding: 0.4rem;">12.7</td>
        <td style="padding: 0.4rem;">0.311</td>
        <td style="padding: 0.4rem;">8.8</td>
        <td style="padding: 0.4rem;">100.0</td>
        <td style="padding: 0.4rem;">0.045</td>
        <td style="padding: 0.4rem;">0.1</td>
        <td style="padding: 0.4rem;">0.031</td>
        <td style="padding: 0.4rem;">0.07</td>
      </tr>
      <tr style="height: 2rem; background-color: #f2f2f2;">
        <td style="padding: 0.4rem;">8</td>
        <td style="padding: 0.4rem;">20.3</td>
        <td style="padding: 0.4rem;">1.359</td>
        <td style="padding: 0.4rem;">39</td>
        <td style="padding: 0.4rem;">12.5</td>
        <td style="padding: 0.4rem;">0.227</td>
        <td style="padding: 0.4rem;">0.5</td>
        <td style="padding: 0.4rem;">0.019</td>
        <td style="padding: 0.4rem;">0.04</td>
      </tr>
      <tr style="height: 2rem;">
        <td style="padding: 0.4rem;">12</td>
        <td style="padding: 0.4rem;">30.5</td>
        <td style="padding: 0.4rem;">2.410</td>
        <td style="padding: 0.4rem;">68</td>
        <td style="padding: 0.4rem;">5.0</td>
        <td style="padding: 0.4rem;">0.454</td>
        <td style="padding: 0.4rem;">1.0</td>
        <td style="padding: 0.4rem;">0.113</td>
        <td style="padding: 0.4rem;">0.25</td>
      </tr>
      <tr style="height: 2rem; background-color: #f2f2f2;">
        <td style="padding: 0.4rem;">30</td>
        <td style="padding: 0.4rem;">76</td>
        <td style="padding: 0.4rem;">25.64</td>
        <td style="padding: 0.4rem;">725</td>
        <td style="padding: 0.4rem;">5.0</td>
        <td style="padding: 0.4rem;">11.3</td>
        <td style="padding: 0.4rem;">25</td>
        <td style="padding: 0.4rem;">0.383</td>
        <td style="padding: 0.4rem;">0.84</td>
      </tr>
      <tr style="height: 2rem;">
        <td style="padding: 0.4rem;">48</td>
        <td style="padding: 0.4rem;">122</td>
        <td style="padding: 0.4rem;">108.9</td>
        <td style="padding: 0.4rem;">3084</td>
        <td style="padding: 0.4rem;">4.5</td>
        <td style="padding: 0.4rem;">22.7</td>
        <td style="padding: 0.4rem;">50</td>
        <td style="padding: 0.4rem;">0.690</td>
        <td style="padding: 0.4rem;">1.52</td>
      </tr>
      <tr style="height: 2rem; background-color: #f2f2f2;">
        <td style="padding: 0.4rem;">48</td>
        <td style="padding: 0.4rem;">122</td>
        <td style="padding: 0.4rem;">142.7 (14 ton)</td>
        <td style="padding: 0.4rem;">4041</td>
        <td style="padding: 0.4rem;">4.5</td>
        <td style="padding: 0.4rem;">22.7</td>
        <td style="padding: 0.4rem;">50</td>
        <td style="padding: 0.4rem;">0.690</td>
        <td style="padding: 0.4rem;">1.52</td>
      </tr>
    </tbody>
  </table>
  `,
};

export const A11_10_2: DocumentNode = {
  id: "A11.10.2.",
  parentId: "A11.10.",
  title:
    "Fissile Radioactive Materials with Radioactive Content Over A<sub>1</sub> or A<sub>2</sub>.",
  bodyText: "Package in either:",
  childNodeIds: ["A11.10.2.1.", "A11.10.2.2.", "A11.10.2.3."],
};

export const A11_10_2_1: DocumentNode = {
  id: "A11.10.2.1.",
  parentId: "A11.10.2.",
  bodyText:
    "Type B(U) or B(M) packaging that meets the standards for packaging of fissile materials in 10 CFR Part 71, and is approved by the US Nuclear Regulatory Commission per 49 CFR Section 173.471.",
};

export const A11_10_2_2: DocumentNode = {
  id: "A11.10.2.2.",
  parentId: "A11.10.2.",
  bodyText:
    "Type B(U) or B(M) packaging that meets the applicable requirements for fissile radioactive materials in section VI of the IAEA <i>”Regulations for the Safe Transport of Radioactive Materials, No. TS-R-1”</i> and for which the foreign competent authority certificate has been revalidated by the DOT according to 49 CFR Section 173.473. Authorized only for export and import shipments.",
};

export const A11_10_2_3: DocumentNode = {
  id: "A11.10.2.3.",
  parentId: "A11.10.2.",
  bodyText:
    "DOT 20PF-1, 20PF-2, 20PF-3, 21PF-1A, or 21PF-1B phenolic-foam insulated overpacks with snug fitting inner metal cylinders meeting all of the applicable requirements of A3.3.7.9., A3.3.7.10., and the following:",
  childNodeIds: ["A11.10.2.3.1.", "A11.10.2.3.2."],
};

export const A11_10_2_3_1: DocumentNode = {
  id: "A11.10.2.3.1.",
  parentId: "A11.10.2.3.",
  bodyText:
    "Handling procedures and packaging criteria complying with US Enrichment Corporation Report Number USEC-651 or ANSI Standard N14.1.",
};

export const A11_10_2_3_2: DocumentNode = {
  id: "A11.10.2.3.2.",
  parentId: "A11.10.2.3.",
  bodyText:
    "Uranium hexafluoride in packaging and quantities authorized in 49 CFR Subparagraph 173.417(a)(2).",
};

export const A11_11: DocumentNode = {
  id: "A11.11.",
  parentId: "A11.",
  title: "Special Arrangement (Competent Authority Approval).",
  bodyText:
    "If the radioactive material does not comply with any of the methods of packing provided in this manual, the material may be permitted to be transported by CAA. The provisions for carrying the radioactive material using a CAA must be approved by all countries concerned. <strong>(T-0)</strong>. These provisions must be adequate to ensure that the overall level of safety in transport and in-transit storage is at least equivalent to the level of safety which would be provided if all the applicable requirements of these regulations had been met. <strong>(T-0)</strong>. Each consignment must have multilateral approval. <strong>(T-0)</strong>.",
};

export const A11_12: DocumentNode = {
  id: "A11.12.",
  parentId: "A11.",
  title: "Authorized Packaging-Pyrophoric Radioactive Materials.",
  bodyText:
    "Package pyrophoric radioactive materials in quantities not over A<sub>2</sub> per package in DOT Type 7A packagings constructed of materials that do not react nor be decomposed by the contents. Contents must be:",
  childNodeIds: ["A11.12.1.", "A11.12.2.", "A11.12.3.", "A11.12.4."],
};

export const A11_12_1: DocumentNode = {
  id: "A11.12.1.",
  parentId: "A11.12.",
  bodyText:
    "In solid form and must not be fissile unless excepted by A3.3.7.3.4.2.",
};

export const A11_12_2: DocumentNode = {
  id: "A11.12.2.",
  parentId: "A11.12.",
  bodyText:
    "Contained in sealed and corrosion-resistant receptacles with positive closures (friction or slip-fit covers or stoppers are not authorized).",
};

export const A11_12_3: DocumentNode = {
  id: "A11.12.3.",
  parentId: "A11.12.",
  bodyText:
    "Free of water and any contaminants that increase the reactivity of the material.",
};

export const A11_12_4: DocumentNode = {
  id: "A11.12.4.",
  parentId: "A11.12.",
  bodyText: "Made inert to prevent self-ignition during transport by either:",
  childNodeIds: ["A11.12.4.1.", "A11.12.4.2.", "A11.12.4.3."],
};

export const A11_12_4_1: DocumentNode = {
  id: "A11.12.4.1.",
  parentId: "A11.12.4.",
  bodyText:
    "Mixing with large volumes of inerting materials such as graphite or dry sand, or other suitable inerting material, or blended into a matrix of hardened concrete.",
};

export const A11_12_4_2: DocumentNode = {
  id: "A11.12.4.2.",
  parentId: "A11.12.4.",
  bodyText:
    "Filling the innermost receptacle with an appropriate inert gas or liquid.",
};

export const A11_12_4_3: DocumentNode = {
  id: "A11.12.4.3.",
  parentId: "A11.12.4.",
  bodyText:
    "Pyrophoric Class 7 (Radioactive) materials transported by aircraft must be packaged in Type B packages. <strong>(T-0)</strong>.",
};

export const attachment11DocumentNodesList: DocumentNode[] = [
  Attachment11,
  A11_1,
  A11_2,
  A11_2_1,
  A11_2_2,
  A11_3,
  A11_3_1,
  A11_3_2,
  A11_4,
  A1A2ValuesCommonRadionuclides,
  TableA11Notes,
  A11_5,
  A11_5_1,
  A11_5_1_1,
  A11_5_1_2,
  A11_5_2,
  A11_5_2_1,
  A11_5_2_1_1,
  A11_5_2_1_2,
  A11_5_2_1_3,
  A11_5_2_2,
  A11_5_2_2_1,
  A11_5_2_2_2,
  A11_5_2_2_3,
  A11_5_3,
  A11_5_4,
  A11_5_4_1,
  A11_5_4_2,
  A11_5_5,
  A11_5_5_1,
  A11_5_5_2,
  A11_5_5_3,
  A11_5_5_4,
  A11_5_5_5,
  A11_5_5_6,
  A11_5_5_6_1,
  A11_5_5_6_2,
  A11_5_5_7,
  TableA11_2,
  A11_5_6,
  A11_5_7,
  A11_5_7_1,
  A11_5_7_2,
  A11_5_7_3,
  A11_5_7_4,
  A11_5_7_5,
  A11_5_8,
  A11_5_8_1,
  A11_5_8_1_1,
  A11_5_8_1_2,
  A11_5_8_2,
  A11_6,
  A11_6_1,
  TableA11_3,
  A11_6_2,
  A11_6_3,
  A11_6_4,
  A11_6_5,
  A11_6_6,
  A11_6_7,
  A11_6_8,
  TableA11_4,
  A11_7,
  A11_8,
  A11_8_1,
  A11_8_2,
  A11_8_3,
  A11_8_4,
  A11_8_5,
  A11_9,
  A11_9_1,
  A11_9_1_1,
  A11_9_1_2,
  A11_9_1_3,
  A11_9_2,
  A11_9_2_1,
  A11_9_2_2,
  A11_10,
  A11_10_1,
  A11_10_1_1,
  A11_10_1_2,
  A11_10_1_3,
  A11_10_1_4,
  A11_10_1_5,
  A11_10_1_5_1,
  A11_10_1_5_2,
  TableA11_5,
  A11_10_2,
  A11_10_2_1,
  A11_10_2_2,
  A11_10_2_3,
  A11_10_2_3_1,
  A11_10_2_3_2,
  A11_11,
  A11_12,
  A11_12_1,
  A11_12_2,
  A11_12_3,
  A11_12_4,
  A11_12_4_1,
  A11_12_4_2,
  A11_12_4_3,
];
