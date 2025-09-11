; G-code for Hexagonal Prism - 1cm (CadQuery version)
; Dimensions: 10mm diameter, 10mm height
; Generated with CadQuery

; Printer settings
M104 S200  ; Set extruder temperature
M140 S60   ; Set bed temperature
M190 S60   ; Wait for bed temperature
M109 S200  ; Wait for extruder temperature

; Preparation
G28        ; Home all axes
G1 Z15.0 F9000 ; Move Z up
G92 E0     ; Reset extruder

; Start printing
G1 Z0.2 F3000 ; First layer height

; Hexagonal outline - 5.0mm radius
G1 X5.0 Y0.0 F1500
G1 X2.5 Y4.33 E1.0 F900
G1 X-2.5 Y4.33 E2.0 F900
G1 X-5.0 Y0.0 E3.0 F900
G1 X-2.5 Y-4.33 E4.0 F900
G1 X2.5 Y-4.33 E5.0 F900
G1 X5.0 Y0.0 E6.0 F900

; For full 10mm height: repeat for ~50 layers

; End sequence
M104 S0    ; Turn off extruder
M140 S0    ; Turn off bed
G28 X0     ; Home X
M84        ; Disable steppers