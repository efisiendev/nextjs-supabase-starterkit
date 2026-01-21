# Typography Guide - HMJF Website

Panduan penulisan konten dengan Markdown untuk event, artikel, dan konten lainnya.

## 🎉 Full Features Support

Website ini sekarang mendukung **markdown lengkap** dengan fitur-fitur advanced:

- ✅ **GitHub Flavored Markdown (GFM)** - Tables, strikethrough, task lists
- ✅ **Syntax Highlighting** - Code blocks dengan warna syntax
- ✅ **Math Equations** - KaTeX untuk formula matematika
- ✅ **Safe Rendering** - XSS protection built-in
- ✅ **Auto-styling** - Tailwind Typography dengan custom theme

## Supported Markdown Syntax

### 1. Text Formatting

```markdown
**Bold Text** → Bold Text
*Italic Text* → Italic Text
~~Strikethrough~~ → Strikethrough (crossed out)
`Inline Code` → Inline Code
```

### 2. Headings

```markdown
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
```

### 3. Lists

**Numbered List:**
```markdown
1. Item pertama
2. Item kedua
3. Item ketiga
```

**Bullet List:**
```markdown
- Item pertama
- Item kedua
- Item ketiga
```

**Task List:**
```markdown
- [x] Task completed
- [ ] Task pending
```

### 4. Links & Images

```markdown
[Link Text](https://example.com)
![Alt Text](https://example.com/image.jpg)
```

### 5. Blockquotes

```markdown
> Ini adalah quote
> Bisa lebih dari satu baris
```

### 6. Code Blocks

**Inline:**
```markdown
Gunakan `npm install` untuk install dependencies.
```

**Block:**
````markdown
```javascript
function hello() {
  console.log("Hello World");
}
```
````

### 7. Tables (via remark-gfm)

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

### 8. Horizontal Rules

```markdown
---
atau
***
```

## Contoh Konten Event

```markdown
Pharmacy Camp 2025 merupakan kegiatan tahunan HMJF yang bertujuan untuk meningkatkan soft skills dan leadership mahasiswa farmasi.

**Rangkaian Kegiatan:**
1. Leadership Training dengan pembicara dari alumni sukses
2. Pharmaceutical Case Study Competition
3. Team Building Activities
4. Career Development Workshop

**Benefit:**
- ✅ Sertifikat resmi
- ✅ Soft skills development
- ✅ Networking dengan sesama mahasiswa farmasi
- ✅ Pengalaman berharga
- ✅ Doorprize menarik

**Syarat Pendaftaran:**
1. Mahasiswa aktif Jurusan Farmasi
2. Mengisi formulir pendaftaran
3. Melakukan pembayaran HTM

> **Catatan:** Kuota terbatas, daftar sekarang!

**HTM:** Rp 350.000 (sudah termasuk akomodasi, konsumsi, kit, dan sertifikat)

---

**Kontak Panitia:**
- WhatsApp: 0812-3456-7890
- Email: pharmacycamp@hmjf.ac.id
```

## Tips Penulisan

1. **Gunakan heading untuk struktur** - Memudahkan pembaca scan konten
2. **Bold untuk highlight penting** - Informasi penting seperti HTM, deadline
3. **List untuk item-item** - Lebih mudah dibaca daripada paragraph panjang
4. **Blockquote untuk catatan** - Menarik perhatian ke informasi penting
5. **Horizontal rule untuk pemisah** - Memisahkan section berbeda

## Contoh Artikel/Blog

```markdown
# Peran Apoteker di Era Digital

## Pendahuluan

Di era digital ini, peran apoteker mengalami **transformasi signifikan**. Tidak lagi hanya sebagai penyedia obat, apoteker kini menjadi konsultan kesehatan yang memanfaatkan teknologi.

## Perkembangan Teknologi Farmasi

### 1. Telemedicine & Telepharmacy

Telepharmacy memungkinkan apoteker memberikan konsultasi jarak jauh:

- Konsultasi via video call
- E-prescription processing
- Medication therapy management online

### 2. AI dalam Pharmaceutical Care

Artificial Intelligence membantu apoteker dalam:

| Aspek | Manfaat AI |
|-------|------------|
| Drug Interaction Check | Deteksi otomatis interaksi obat |
| Dosage Calculation | Perhitungan dosis yang akurat |
| Inventory Management | Prediksi stok obat |

## Kesimpulan

> "Teknologi bukan menggantikan apoteker, tetapi memberdayakan mereka untuk memberikan pelayanan yang lebih baik."

Apoteker masa depan harus mampu beradaptasi dengan teknologi sambil tetap menjaga aspek humanis dalam pelayanan.

---

**Penulis:** Dr. Apt. Ahmad Zainuddin, M.Si.
**Tanggal:** 15 Januari 2025
```

## Emoji Support

Anda juga bisa gunakan emoji langsung:

```markdown
✅ Checklist
❌ Cancel
🔥 Hot
💊 Medicine
🏥 Hospital
📚 Books
🎓 Graduate
⚡ Fast
🌟 Featured
```

## Advanced Features

### 1. Syntax Highlighting untuk Code

Tambahkan nama bahasa setelah ` ``` ` untuk syntax highlighting:

````markdown
```javascript
function calculateDosage(weight, drug) {
  const dosage = weight * drug.mgPerKg;
  return dosage;
}
```

```python
def calculate_molarity(moles, liters):
    return moles / liters
```

```php
<?php
function getUserData($id) {
    return User::find($id);
}
?>
```
````

**Supported Languages:**
- JavaScript, TypeScript, Python, PHP, Java, C++, C#, Ruby, Go
- HTML, CSS, SCSS, JSON, XML
- SQL, Bash, Shell, PowerShell
- Markdown, YAML, TOML
- Dan 100+ bahasa lainnya

### 2. Math Equations (KaTeX)

**Inline Math:**
```markdown
Konsentrasi larutan dihitung dengan rumus $C = \frac{n}{V}$ dimana C adalah konsentrasi.
```

**Block Math:**
```markdown
$$
pH = -\log[H^+]
$$

$$
\text{Molarity (M)} = \frac{\text{moles of solute}}{\text{liters of solution}}
$$

Rumus Henderson-Hasselbalch:
$$
pH = pKa + \log\frac{[A^-]}{[HA]}
$$
```

**Common Math Symbols:**
- Fractions: `\frac{numerator}{denominator}`
- Subscript: `H_2O`, `C_6H_{12}O_6`
- Superscript: `x^2`, `10^{-7}`
- Greek letters: `\alpha`, `\beta`, `\gamma`, `\Delta`
- Arrows: `\rightarrow`, `\leftarrow`, `\leftrightarrow`
- Sum: `\sum_{i=1}^{n}`
- Integral: `\int_{a}^{b}`

### 3. Advanced Tables

```markdown
| Drug Name | Dosage | Frequency | Route |
|-----------|--------|-----------|-------|
| Paracetamol | 500mg | 3x/day | PO |
| Amoxicillin | 250mg | 2x/day | PO |
| Omeprazole | 20mg | 1x/day | PO |
```

**With Alignment:**
```markdown
| Left | Center | Right |
|:-----|:------:|------:|
| L1   | C1     | R1    |
| L2   | C2     | R2    |
```

## Contoh Lengkap: Artikel Farmasi

```markdown
# Farmakokinetik Obat: Konsep ADME

## Pendahuluan

Farmakokinetik adalah cabang farmakologi yang mempelajari **nasib obat dalam tubuh**. Konsep ADME menjelaskan 4 proses utama:

1. **Absorption** (Absorpsi)
2. **Distribution** (Distribusi)
3. **Metabolism** (Metabolisme)
4. **Excretion** (Ekskresi)

## 1. Absorpsi

Absorpsi adalah proses masuknya obat dari tempat pemberian ke dalam sirkulasi sistemik.

### Rute Pemberian

| Rute | Bioavailabilitas | Onset |
|------|------------------|-------|
| IV | 100% | Sangat cepat |
| IM | 75-100% | Cepat |
| PO | Variabel | Lambat |

### Formula Bioavailabilitas

$$
F = \frac{AUC_{oral}}{AUC_{IV}} \times 100\%
$$

dimana:
- $F$ = Bioavailabilitas
- $AUC$ = Area Under Curve

## 2. Distribusi

Volume distribusi ($V_d$) menggambarkan seberapa luas obat terdistribusi dalam tubuh:

$$
V_d = \frac{\text{Dosis}}{\text{Konsentrasi plasma}}
$$

> **Catatan Penting:** Obat dengan $V_d$ tinggi (>1 L/kg) terdistribusi luas ke jaringan.

## 3. Metabolisme

Fase metabolisme:

- **Fase I**: Oksidasi, reduksi, hidrolisis
  - Enzim: Sitokrom P450 (CYP)
  - Contoh: `CYP3A4`, `CYP2D6`

- **Fase II**: Konjugasi
  - Glukuronidasi, sulfasi, metilasi

### Contoh Kode Perhitungan Clearance

```python
def calculate_clearance(vd, kel):
    """
    Hitung clearance obat
    vd: Volume distribusi (L)
    kel: Konstanta eliminasi (1/jam)
    """
    clearance = vd * kel
    return clearance

# Contoh
vd = 50  # Liter
kel = 0.1  # per jam
cl = calculate_clearance(vd, kel)
print(f"Clearance: {cl} L/jam")
```

## 4. Ekskresi

Ekskresi terutama melalui **ginjal** dan **hati**.

### Checklist Monitoring

- [x] Fungsi ginjal (kreatinin)
- [x] Fungsi hati (SGOT/SGPT)
- [ ] Kadar obat dalam darah
- [ ] Efek samping

## Kesimpulan

Pemahaman ADME penting untuk:
1. Menentukan dosis yang tepat
2. Memprediksi interaksi obat
3. Menyesuaikan dosis pada kondisi khusus

---

**Referensi:**
1. Shargel L. *Applied Biopharmaceutics & Pharmacokinetics*. 7th ed.
2. Katzung BG. *Basic & Clinical Pharmacology*. 14th ed.

**Penulis:** Dr. Apt. Ahmad Zainuddin, M.Si.
**Tanggal:** 21 Januari 2025
```

## Security Note

Konten markdown akan di-sanitize otomatis oleh react-markdown, jadi aman dari XSS attacks.
HTML tags tidak akan di-render kecuali dalam whitelist tertentu.

## Live Preview

Untuk melihat preview saat mengedit konten, Anda bisa gunakan online tools seperti:
- https://dillinger.io/
- https://stackedit.io/
- https://markdown-it.github.io/
