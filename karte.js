const MAP_DATA_URL = 'https://script.google.com/macros/s/AKfycbzt2DTR1djboA_HP0NzpZeHj-TZB5PQmhX8FM6cJFiOyjQwsZyz8Jl-xOLqLPDJ3fCZlw/exec';

mapboxgl.accessToken = 'pk.' + 'eyJ1IjoidmllcnZpZXJ0ZWwiLCJhIjoiY21hbnN4c3V5MDJkeDJrczl1ZjIxaGIzMyJ9.7GPJr4HzvulQJmMXY72CEA';

// Das sind die Original-Pins aus dem ursprünglichen ZIP-Ordner.
// Sie sind hier zusätzlich eingebettet, damit sie nicht fehlen können.
const pinImages = [
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAABpCAYAAACUAxWTAAAACXBIWXMAAAsSAAALEgHS3X78AAANY0lEQVR4nNWdbXBU1RnHf0utTAVdXHQKQsz6VhWr4Ft8CS0b0Sa1tcKm1SJqNgud6bQzJctM+0U6bmb80LFVYGqZtkMQZqCatIbQ1hKnQpYmIL4MbgSisTu4MVU3EzeybAz6oT39cHNv7s2+5L6cu7v+Z84ke++5zzn73+c5zznPebkeIQRlw5hnHrBs8tMyYN4MT8Qm/ybxiaRLtTIFT8mIG/MsAwIoBPmBFRKk9gNJIA7E8ImYBJmm4B5xijatQiFrFeB1p6Ac7EPRzC43tVI+cWOeABACmuQKtoV9KATulC1YHnFjnhDQAiyVI1AqhoCdwBZ84rQMgc6JUzRsC5VJ2HRkgCg+scWpIPvEKW3YTuB+p5UoA/qBFifOZJatp8Y8q1C82ReRNFCso4cxT9SuAOsaN+bZAmyYKVvj+nrmeefQsm6C65d026xeSdAPBKy2feaJU0xzCya9pWe+8jccCtL2VKeVOpUDGRTy4mYfMEecQloMCw7grsZaemKHAfj4nSrmXzxs9tFywRJ5M7dxNkgDuO/er2n/vzHwzZz76dEqzk6Uqk9sCl4gNjnCmRFmnIPprsaR1xs5PtBAerSKu+/4SLs+kDjXkC85VMMtDbN4+Ge3f2HJK06c4nVMtWkvHVpLbcML3PCNbi66ZpjvPfK2du/w0Y8MeQ8c/TrJ5BCde18ikbzDjPhSwgt0TVpaQRQmTulyPG639GRySPt/319fpnVzE+nRKrviSo1qlD5qQeR3DgrbSSwOzI8PNPDa8Us4OXiWvfuOGMhT8fONa/FfOpuftuwA4K3ehkrurkQKjTIKEbcTCYP05FANv/5jNS/s/RcjIyPa9TlzzuPTTycAo8dtaw/zxJMH2PP7W7jz1hecFi8DGWBZvihLrqkqY0/HpKVHqxhMXsVnn/3XQBqgkeb1XqCRdnyggfU/2UEyOcTbpyrGYXhRnGMO8rVxUaelqV6zIbiHHTunOr/f/c5KHn1kapSWyZyhJfpDAF5+ZaF2/fw5/3NaBZm4f1KZDDjH8EnJ4DgyO5i8imTyNe2z31/Npl+sZN2DSrt2eXUT0Sd2AbD1t88z97xH2NN+UMu/8rYDTqsgG1GUgKwGYxs35okhJ6TNkdcb+c/I+Vx7eYrrl3STHq2i6+A9/OfD/2qk5a3hpiYejxS+X0bU6aMpU8Qpnb433SgxPVrFRdfkDrluq7mJV187pn1euHAhx3vOyTs8Sw7VkP3UB8CHo/PJZL/MtZenALjS/wpfOS/jRtX12IdPrFI/6E21xa0S5188TGTDGjZvfU679vSTzfx4TSdP/mHKbK+84lLmX/wqxwcaePvUAo4e+5x4//uTY97XCkhXUBeoZcXyK7ln+bhbHvl+xjx+1cPqNe40Lk+oHB9oADD0285OeFn5g6t45egbgOJpM5kzjspR29SH7ntBtiZq/TqFOGWUsFdmCcVwdsLLmyfv5p99cznUl9CiKIUQDgXxemdz3dVfybl3ZlxwYiBj8N4qpjslCejHJ5bBFHGmgpN2kRyqYTB5FQOJc+l75UM6975UMO/8+fN59OFvcftNszXHYhZHXm/kL/vPNTQJAMHV9Tz1y0/wVxc3d5O4EJ84rRIXR/JkS1t7mD0dgzNqEyhfbPkdl3D3HR9JGX6lR6v4xa9uzdHC7s611K/Y41T8anyiyyPSzAM+cSptOtQIcD6oRN12wxluvO5l1zzikdcbWfvjNwxjZgndna34RItHpAkAPQ7rmIPWzU2G/lpwdT3RjZ6crkN6tIoDr67k6LHPGXp/LK8ZB1fXU32pj9tvms3K2w5YiiafnfDy2G/uNZivQ/IO4RMBRJqoSCPcSNFNTQLQ0lu9Ddq97s61IhwKGu6bTcHV9aK7c62lujz9ZLNBRnRTk/3vJgSINFvcIm46eX5/tTj6z1WiLlBr+BIbIxHR0dEu4vG4yId4PC46OtrFxkjE8FxdoFYc7m40XZfuzrWG562Sr0t+RJqYm8SJNHk1y++vFm1t20U2m81LViFks1nR0dEu6uoCmqzIhjViYthrqi7tu0KGerx3rMbOdwqUhLiTR+42VHbz5qctE5aPwLa27Qbtm4mE7s61OdpuU+tWIdKcdpO0947VCL+/WgBi1qxZYtu23zkibDoSiYRoDAY1Lc5H3lu9DTmEqfltfq8obpI2MezVKtwYDIpUKiWVNBXZbLYgedOdgqqd7btC4uN3qiqTuODqeo00p6Zphbzg6nqRHlysla/3xnrP7iC5R9z2bWFNAxKJhKuk6clTm4UlS64xkLZ9W1jm94t6RBrpa1n18be+3l5qly8HYMeONs6cOcP69T9i7ty5sosFoL+/n2XLpuaT/f5qejq/KmucqqJ1FnBIpkSAZ3bfBcC6cFgjDeDI4SNEIhsJNTUZJnD6+/u57DI/69etyytvfHyc8fFxU2UvXbqUTY89BsCFF17oBmkKhOTuyMfvVGnmMd0ZJBIJzZSY7Jao7RKTHeF8ULsdHR3tOffi8bhoa9tuuJZKpfKOVmSaqvSRg+rFCpGQSCQMnVc9iYUciL6/1hqNilQqJVKplNi8+Wnt+nS0RqPOh1aFUwCRpkWmULX70dfbm5cEFX29vaKtbbtoa9tuqpuiEpEvtUajeX8gnPXVZiQu4IaZuoG+3l6DtjYGg0V/IDWvC+Y67xx8IsaYR0p7OZisAYZZFw5LkTcdtcuXc/Cg+QhYYEWAnp4Yb59awPVLpFUjg0+cVmfypXhWdenCnbV3yhDnGIurFgPwwYgcxZhEDKaWQHTJlFwpuPnmWwA4MSA1whyHqXnVLmCzU4knB88CsOiSRbZljIyM8Nxzf+LE8ROAor0PPPCgax1mG4iBSpxPJBnz9ONwwiaT+RyABQsXzpAzP17q7qbh2982XGvbsYNotJWenh6uuOIKJ9WTgYy6DEK/WsnxNp1LF58PwLvvDlp+9nBfXw5pKoaHh2luDpkePbgIrUmbNe2io8Zg8SVfAiCbzVp6bnx8nDUPPVQ0T29vHx0d7Zbkqj+g1zvb0nNFEFP/mSJO2VniyEksXqCY6skTJy09t3//Pxgennnmavfu3ZbkfvDBBwB5VwDYQIYCGgcOFxVe7f83AJ17re2kaX/enCb19MRyVncWQ19vHwDXXi7Fq3bpty3lrgEe83ThYHPbZTdXk0wOkUgkTDfmHo/5flY8Hmfp0pl92MjICAsWLABgYtgrY9LbsD4u31JWR04i9HAAgD0mzaq/v99JcQXx4ot/ByCyYY0M0oamb9HMJU7JYHskEaxXTOnZnc+W1Quq7WH9Cns7S6chR5kKSQ3ZLeH6Jd2EQ0GSySHLXlAW/vznDnp6YtQFamUsssmQb7OIECJ/SrPTbvTgrd4GLYIx03yDPuhoJs0E/byDg5l6fYrm46cYcfOEgznXyIY1pme48gU286VCwVE91oXD2oyWrBCSNeIU8mwvyJkY9mq/fL5Aox76SG6xVGhtiQo12FloYtpG2lKIm+LEKeTFZZhsMfJSqZRYtGiRI23TR4glmejpQtpmljhHEWL9CqGNkUhBs+3ev78gacXMPZvNukFawbbNPHEKeY4mdPTk1dUFCprc9ND4okWLik7i6NeNSCatqLZZIW6eSJN0Upn3jtUYFr5sjEQKTtKkUqmi7VkqlTJomd9fLXteITQTJ+aIk2CyIq04jOmLYNaFw6Kjo33Gma5UKiW69+/PWVwY3dRkem2cyRQzw4e1c0ckLetPj1bxzO67cvZ0+f3VrLxrZU7+U++doqcnZrgW2bCG5u9/4sYm4RvNnARh58AWaUv7z054+dvB1Rw99nnO3oR8CIeC1NddYHkBtQW04hNRMxntELcMJaAnffuSfqObHufPGXNn/YcR2q4ZM7B3KJVy5Nmz1h+saJgyURX2QgfKQXYVuanUJiJWSAPnx6DF+GKcG1cMyoYPi7AfrFLCyCEcTvCUGUMo53dahrMon6LeIUcyyotVdo9+dB4e9YkuIOJYTunRbLVd00NKXHly1/AXyVlsdXpSq9zjbF3Y9+oCduETIadCZBM3D2U1T7U8oVJhqZNbDHJMVYXS0K6iMj2tchamJMglDlRPa8vFuwhbB4gWg3ziQJ2bbXZFtnVIJw3cPl1f0nFqDlDwGDOncEfjptCC8ouXA+opq0k3hLv/Pocxjx/F05b6ULi66es9ZMJtjWPyFw+5Xo4RzW6/FMN94kAdlpVqZOF4VGAGpXz1Sik6x4ajytxEaTQO9GEotzDksnwDSkccqP27rS5IzuAgRGQHpTNVPcY8SeSabHMp2jU9SqtxUwhJlLWr1KRBuYiTZ7JDuHhEZTGUx1TB9rHg02BpSk8mymWqMrxsa7lIg3JqnAp7Zw9LC0jaRfk0bgohi/mVrkeZUX7ilLGsFUexpdxvuoRKMFWw4ijKbqIqyq9xoDqKqImcIXcrYh6VoXEqio8otuITZemz5UNlaNwUogWuZ4rcKwsqizhl6JQv1N5SygG8GVSWqYL6Mg79qSwV4xD0qCyNg3zbPiumXdOj8ohTEJ38e6iUL9S2gsokTiGrnwpzCHpUXhunQve2jkrE/wGMXFE4YUhleAAAAABJRU5ErkJggg==',
  'data:image/png;base64,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',
  'data:image/png;base64,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',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE8AAABoCAYAAACwna0IAAAACXBIWXMAAAsSAAALEgHS3X78AAANCklEQVR4nOWde2xUVR7HP21MNjzKYFmCu1jmippdARUlFhSFGVi3NZFHhw0sQmQ6mKwhu0DBuP9gmIrGhaw8N9VNCpRE4gLbgtHANCqdpgV3QXEKgso2dJquaw22UlpKXFfO/nF7b+d979zHzBS+yUlnpud1v/P7nd85v/M7Z/KEEGQc3XlTAQlQ/koD/5mtUbIdCA+8DgFXgCAQolBcsbaT2sjLCHkyWQsBF9oEGUU7MqFHgCCFImxTOyrsI687zwV4kUlz2NNISrQANcARu4i0lrzuvNHIZPkBp3UVm8Y7wHYKRdDKSq0jrzvPD6wlO1KmF+2A1yoSzZPXnbcQ2E5uSZoWGoG1FIqQmUqMkyeraA2wwEwHsoxKCoXfaGFj5MnG4Ai5raJ60QIsNGJU8tNuqjvPCzRwcxAH8CAQGhCItJAeed15NcDedBsZAnAADQOCoRv6yZOJW5FWl4Ye9qZDoD7y5GnIzU6cAt0EahsMuaKbUVW14NaaD6YmT16Tfmptn4YMeoCpqaxwcrWV53FHrO/TkIEDjedPNeb5GVqrBjvw4MB4nxCJ1Vae8zRY2YtzF0rV1wUjupGcp6ys3m7clUh9k5EXxAK/27kLpdTVj8P/yr64/0mSE+9yF79ffpwxYzvMNmU3GikUrtgP48mzSOq27S5n3YuDRtrtdjHxrokAXGq7RENDUP1fdZWPlUv2mG3SbsRbXyFEdOoiKLoQZpJ/wwoBCEBU+v2itbVVxCIUComVPp+az79hhak2M5CCsVxFS54FUhcpcYFjxygpLU2Zvz4QoPSppwD49ZOz+OGHH2kInojKI0lO5rimMWWSg+kPXOWxR2rNdNEMHop0Y8WSV4OJlUTX5SJ++kt5/NJDnIJDhw6yePES8vPzuXHjhmb+LI6X+ygUXvVdhLqOtkpd11VUxKmpFhQVfm2TN67etjPF4kRgkdi6pVy4XTNVVWdA3fs7HJlS3Suii9HxamvBMuyuaU7C4XZaW1u5++670yp7ormZx594Ak9ZCbXV9SnzxlpxSXLyJ7+bvv58Tp4a3IGccGcBMx7+H7MeeY9hw3vSf6DEKKdQ1ABRknfEzLfSdqZYAEKSnGlLnRBC9Pb2qtKkt82zTaXiqVJ3lCQmSpLkFNVVPqukr0bh7LYIRl1mvo6/ByYDp5g7Z66h8iNHjlRfnzy9iM8vObhvYg8FI65x/6RAwjL/uTyGY4H9gCx95d5y5s6dy8iCAgAuXvySA387QG1dHc+t2sPR90t4a+c/zErhQvXVgNS5zHwbB/Z51W95wfz5hiRPyONH0lSxZqk4EVikthmoW6b+b11Fhejt7U1ab3NTk5AkpwCEp6zEijFyqhBCJW+t0YrONpXGPagRdHZ2quV9Xo+orvIJn9cTZyDcrpni+LtLVDIq/X5d9be2tqpltm4pN0ve2kjyaoxW5PN6VMlQHrS5qSlt8gLHjqnExbbx7RdFYuuWcvXhlbTS50urjVAopJb99osi0+OeQp6hVUV/hyOqM9VV8nRjkceT1kP19vYKt9slQFbHVO0pbQAiFAql1Y4Qg1OiA/u8ZsgLRpJnSmUVaenvcKStTkIIUen3qyqpt02325U2cUKklvA00hUhhIGtxxQYNryHN7c+DsBGv5+XKytT5u/r6+Plyko2+v0A7NhUoNnG55fuAMA122Woj/fcey8AbeFvDJUfgLztKrqQjH4DUXO7iM/HjBkzOMC7XSJw7Jjo7OxUv/3Ozk5x8OCBqDEslbpGJkVtd++uNiR5QgxadROSJ0QX0m0MBhamDcWhGQ6303W5iDFjOzh5ehFdXbVMmTKJvr5rNDQEo9xPsXC7ZrJjUwH3T9qvq8077/gegPOfnTfU55aWFgA8ZSVA6pWMBiTTaluxZikAR44/CcA/z44CwPfsdC40XSFQtwyf1xPdquSkYs1SAnXLOF57IukkOBF+If0LgLrDdYb6e/HilwA4JxQaKh+J27SzpEbJ7Hy27YBXtnzIM/McfHZBnr1Pf+Aqw4b3UDJ7PyWzYffrkaXaB1L6kJynkCR5DV0fCOj23CjYtWuX2m+zMF1Dyez9eMpKCIfbWb56BntqZIl4aPIHpjuXDBtelJeAm7dspq+vT3e5Q4cO0tTUDMDogmum+5GPHBRtCq+/9B2S5KTu8OAYYqEXIw7PzKvF7ZpJQ0MQ74oVugisDwRYvHiJ+j7QaD5OKd9sgB/IqtRQN46ioiLTHbre7+Dge15Wrvewcr2HbbvL6bocXe+w4T3s2foDkuSktq6O+fPnqYYgFn19fWzfvk31Vq/5w28BaGxuNd1X2Z/XnWdJbO35L55kysz3cbtmcrz2hHaBGITbi5m14Gs6OqK9w+PHj2f3Lhcls/fH5Xd7viEclsdPt9vF/PnzGTVKNlrnPzvP1m3b1Pxbt5RTsXIveWPk96Ir7S5G4naFvCAWhfgb7Vgy4hSMHz+elg/z49zu1/sdvPm2h51Vx1USE+HAPi+Ln65RtwokyUnbJ8aMFgCFIk+xtmHsOx+hC+s33U5HR/KN8K+++oq/vLWCjRXRe8DDhvdQsXIvzy918Ol52Q+ooGDEDf68K8Tpj0PcN7ETgI8vzAL2M8c1DaMWXy0o5LWt1+RsW02KZ+VsU6nuMpG+Oa2Ubn9iyyn9s8IxoExVgka/glhMfXACMLgG1YP6Ru0dMwWRYRt688qrCTj4npeG4Akkycm8OYd115MAQVDmeXIchokBYBAzHv4JAPUNV3WX2bbjbSuajsMHH/0MgAcm30F94zKWrKgBYHOl2+xUKgTRk2RLwsnmTv8QgD01dXFTjERIR5LSxc6q4wB8/98fKfXIltq/YQWLn64xW3UQoskzXSPAmLEdcevdbGDPQZ9qfV/b8hYgExdrcAygRTlhOUiePFm2RHXLf/MdIK939UhfOigY0a0r366/nlZfe8pKONtUagVxEGEfYte2NVbUfv+kAD6vh3C4nVffeNyKKgHZG6Mnrm/3AR+h0DnGjRtH+NNp1FbXp+W50UCN8sIW8gBeWv1vQDYG9Y3Lkua7R/pId52rV83RzBNuL+a5VXK42r43foVzwie669eB9sjlbDR5stW1RLYl5ymqq3wAPL+umXB7ccJ8w4b3qFMJLTw7P7Wn5nq/A7dHdq9XrFkat5yzAFFGNZFLartVLa1cskdVX7fnm6QErv/dyISfR6K6ypcyIup6v4Plq2cQDrfjKSvh1ReOGu53CtREvROxwY0WBTgqqb/DITxlJepeR+Suf2SKDIiMTVqBj21nitWVgyQ5RduZYkv6HpNCsTwlI89U+EUqAhnYsU8U8lBd5RNFRUVR0QFaG0ORoR6eshK7iBOiC28sT8kPsVjoaVEQGTXqds3kj6ulhONS1+Uiho+4mnIVUN+4jM07w2oUacWapbz6wlG7nLA9FIrRsR+mIk8C2qzuxbkLpax5qVd9aElysnrVHH716Nea04lwezGHP5jMu0cvRpXfXOm2YtWQCgkPNWsdn6rBpgN7sZKjQNlpmzLJwaiReWqworI3okCSnGx4cS7PzKu11eWPfIxKSnRvixZ5o5F9fbYdTD55ehHvN4+ksbk1jshYSJKTsgWPUTI7345pSDIkPUqv59TjWmBb6kzW4Hq/g9bwo/ReG6E6NZUAx5+PPZ+Nwy5JpQ703jHQnRdCPk5+qyHlBQ56ybsVj46mlDrQu+ktr+dShzzdfFirdblXeleD3Drq20KhmKqVKd1wC6+xvgw5ePVkSo+8W0N9d+iNojB6o0+QLO/z2oR25HsFdMXvGI2S8iJbo5sN3nRugDRGnuw09Roqm7vYke7VcOaugJMvL9hovIKcgS7rGgsr7s8LMrTHP837U5LBiqMEC7FoyzJL8Bq9U9Q8efIAu5ChaUAqKRSGIyWsvDPUy9C6c+odCsVC7WzJYd0JIPn081CZQLdgwWzB+nuSc/+evRbAZcWN3naQNxo5niMXHQg9yMSZDmIHu27olgkMkVsXeVlKHFg55kUi9yyw5cSBXeSB4oHx2la/fthCHNhJHjAwh8q2BTZ9E3cyZOonHYJkZwk3eIGMDbBX8gaRjfFvh53EQabIGzQgmcI7FIq1djeSKcljwFe2IwMtWbJ60IPMjHmRsHcHzrB7yQgyJ3mD8NpYt6FfFzCKzJNn3w5cpdU/U6OFzKutAmvVN+FtsnYjG2qrwGtRPT1k1pKryB551qnvwmz8YBxkV/JAPrZgZv8j7e1CK5Fd8mSJMTqZbUG+vz5ryJ7BiISxte9Ddi349SLbaqvAm2b+ymwTB7kieQDdeduBNTpytlMoJJt7owu5RJ7eyHvNn5fJFHJFbRXj4dfItS9XiINckjwF3XlhEm8caQZYZxq5I3mD8Cf9PIeIg1yUPEgkfTljJCKRi5IH8dLnzUIfNJGbkgeR0pcVj4ke5KrkwaD0+VPkySpyV/JAnjhnYCPHKP4P2uyMZlznrG8AAAAASUVORK5CYII=',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAABoCAYAAABfX8Y2AAAACXBIWXMAAAsSAAALEgHS3X78AAAM9ElEQVR4nN2df2wb5RnHv14roXaFIIeqCDX1FXUUtc2SDhY6JVvsBJRQfixxJipWIOacSWxCJGmljT8KvWgMCSTSgFCJIDYuFFCLmoYVyY5EGrtpuqYdnYNLATVp7AZBqtZWg71E7A/e/fHmLr74bJ99750NH+mUu/N7z735+nnvfd/n3ve1iRCCghAzWQFwCxsAWFVe6V/4GwRwHWbiT59UP0yGCBczcQCaQMWpBGBhfIdxUCH9APwwkzBj+ynoJ1zMVAnAASoYa6GyMQ4qYo9eIrIVLma6GVSoDgAV7AxrIgDAAzPxsDTKRjgqWMfCVqLdoC5EAAisBNQuXMzkACDA+OKYLxEAHTCTAS1G8heOPvA9AGq1ZKCABAA48n0G/iyvW1IvC+LHKxpA8x5c+F9yJnePi5l6ALTnc7Mi5gDMxJHLBeqFoxVAD4DWnLP14yAAoAlmcl1NYnXCUdH8KJ4mhl6MA7CqEU+tcAMAfq89X5mJXi3DwPH7cOPPf8BDdUexYuWs3rdUQpV42YWLmTwwoHiGI1Ww2a8gHI4AAOzNDTj42ulCiZf1mZe5Vo2ZOmDQM+3vr62VRAOA/qODeP9YixG3VqIVMZOQKUF6j6N9zf+wz1Mq0atluOXO6ZTzHGfB1KcRhSsMw5Yu+pLJ4zy6ZEWBobF6ab/75SfR2f4oACAcjuDU2YJ5HQAMLFSMKSgLR93UsBq09+2L0v4TD3+Cbb+6QToe++wmo7KhRAloEyyFVOFoV6pD1+wkEbrQiGH/KACAd9hRunoa9fcMSZ+f/Nc3KdecOtuCupZquA7xmJ/TPabQuhB0laHkcQIYRTgOf+yA6xCP0IXGtGn6B9dI+488vAIAULp6GjZrNf386CDm50owP1eCwcBOtLQ1oLrxCIb9o2j7ixtPP1evaJcxwtITy2VH1NuY1KLhSBV2tHqkY95hR4dzDuWbfNK5+bkSeA76AdCK4He//lj6rLZmg+SJjz2zDf1HBwG8xyJr+VCLmMmaXFEs9ThmRZSznJEduz39+OVvfXDutiN6tQwAcOLsg1ITxPGYVdZmu68mIe1T0RYRvdFghOSDReFo7eFgeSeOSw3RuT39uOXOaXTta8Wb716Tzrfav5Cl27r5E/AOu8yWsKcVn4004viRUZbZVEvtQomkEELoFoWDREFYbrzDTgAQAKRvP084ziIdJ282a3VaG5+NNJKpc1Wyc1PnqqRrO9sfZZrnLFuPqFdyUW1i/RVt2bRYx1SVf4MLI9fRt59P8cSnnvxFWhvlm3wpxT7+X7O0v3njCka5VYWkEa0caDFl3onftOF/0v6Z0G0o3zQL5w43/vhQCd4/xuPzr+bRUPszNNR6crJ7JnSbtL/21u9ZZVcNFsRMlTCToFirWvW4y92bTkj7p85ch3MH3V+xkgqYL59/NS/tb+QuZkipC00AgrSvqmNUt66lWmpWzE2XMIl2mErp3wL1ZQMwE6vocZV63eWh7XdIwp04+yAaapXbYtGrZRgaq8cXFwkufx3HVPiKdJ3NWo313BqsW3sjli0DgAMAaBNG3DeQWmCxAazbS5d7f/OttD8Y+AENSXeanyvBsePNODTw7UJbzaNoY9g/imGF88uWURuGx+xipkoTiUL38FFycb32ZRlKV0/DdYjHCy8PyWJwuzo7sXnLZtx1190AgIoKGmeYnJxEIpHAp5/+GycCJ3DgnXekazjOgj1/rdf0zMyDZpAorHq3f/r281K7a8+zjxN7c8NiG85mJT6vl8TjcaKWeDxOfF4vsdmskh17c0NKe0/HTTCRKAQAe/X8epQClRxnQe8bvWhoTB8AUMOgz4en/vwUwuEItdldk/Y5ypAD+b2QzpHS1dN44vHFZuKuzk6EQuc1iwYADY2NCIXOY1dnJ8LhCBrt72EwsFOz3Sxwhgg3GNiJd979CADwp7Y2vNLdjVWrVjGzv2rVKrzS3Y0uQQAAQ8TTXbjQhUY02mnR6RIEvPnWW7rd6/m9e2XiZYoDakVX4ebnStD+XBwAFe35vewfpVeuXJEdJ4vX/lxctwixrsL1fmDHsH8UNpsVu3bvZm7/Dy0t2LbtHiQSCdn5Xbt3w2azYtg/it4P7Gmu1giJQtCjyr72ZZnUVAgGg6qbGkvxeb3EyfPk8OFDsubIrs5OAoBwnEWxKRMMBqX7X/uyjPX/59fN414/WAcAcPK81JBNx/j4OD788LDiZ9/Fv4PL7cYjj+xAXZ0NPT37UF6+Bd379gEAet/oVaxoKioq4OR5WV6YQnQIYM5Nl0hBy2zeNjMzI3lGukawy9WXEgTlOAvxeb0ZbYtex3EWMjddwtTjdOk5+Pp3EgCkxW6X/fMAiJPnJTF9Xq8kiJPnM4ogCuFy9eXU02ix0yi0r38ny//Rsxxm4kfMxNSLT5+jsYPtD2yXzm28YyM4zgKX2w2XW96v5DgL/vHii1ntVlRUZC32S9n+wHYc6e/H6XPLZQEGjYTFZ9w4M5MAAicnAEDqrANAdU0NTp8eQ5cgyELnXYKAUOg81qxZk2KHBWIexDwxIqxLIFMMNJJCTXdagslESxSJMjO5VfQ4PyuL4UgVAMBms7IyqRnRw8W8acZMgsyFE99A3b7+dk12EokE3G4X2pxOrF/Poc3pxKDPl+0yRerr6mV500gAEHsOdNjmRyyssiCRSMDR2gqnsw0utxvhcAQutxuN99+PNqczpadgMH5A3uXSNNOEJR3t7TjS36/4mcvtRkd7QWcLDABLR2TGTNehcaTS/FwJVpbRdwD5VA6Tk5PYsGFD1nQuVx943qnKplg5MHjLFoGZcEBqJ9+jxSoAWcbyKVLHjv1TVTpB6FKVLjl6wuCljlQqlwqnOPowV8TBMuPBYM7Xng+dV5VuenpaVWUxcfGiLE8a8Yg7cuHohDDNlYQ4ZmRoaChLSm2MjY1lTSPmIXkcS55EYCaSJyhFRzR7XfO9nwMA3va8rdVURi5fvpzx80QiIeVBzJMGZLqkCkdHHQa03IGznIHNWo1wOJJ320sNl6YuZfx89ORJhMMR2KzVKSOe8sCTfJAuHidovYs4dOull1/K6bot5VtUpx0e9mf8XLz3357hcsqDAgdSpigRcWDh0i0Kj9aYnM1aTQAQl6tPVQiIEEJOjowoDj5U2jKFosQwVqZBizlslUv1yRQBFrR8RStWzuKFZ28FADidbZicnFR1XXVNjep+7rp16xTPT05OwulsAwApDxoIJFcKEmk9jnqd5vcRne2PSkMd1AYffV6vKo87OTKScm08HpeCo4yGuVqVtMkm3M0kirDWIiuOFWmx21WL5+T5jKIlR5eTRRMjvvbmBhbhcn86bTILR8Vr0vqtTZ2rkrygxW4nExMTWYWLx+NpxSsrK0uxMTExIYnGcRZWA3AUvU2dcFS8ARbiiZUFx1lkr/sy4fN6ZYJ0CQKZmZmRpTl8+JD0xdis1axEG8ikiVrhOBLFda2ZmZsukQ3hT35xkw/BYFDmlbzDzvJtFqddOCpeB6MMpcx5aLHbic/rTfEkJWZmZmReKHpi336elWCERCFk0yO35TMYzs2PXi3D6wfrILwgH8Nrs1mxtXIrNm/ZLDt/avQULk1dSmn0Cnta8fRjx1G6OnWicJ5EAFRqn5OfDJ0PEQbD9ZPEccCDw9/B7VEOXi6Fd9jRYLtJrwUP0s6KTiafBVuaABzNL0/ZCV1oxDdXS/H1zA2y82tv/R63rY7KZh/qwEcwE1UzjPJbW+mnudrNLACO7YItSsRMQfy0FnBRVURFtIxWagL9ln4KvJrrWpva1o/T+XlnEOMwk5xnFmkbH0cXr1P31qQ4mUWe001ZLfVoyNpLOpDTcy0ZViMyHWA84skAOrWsIcxuVVY6Xz2I4l1cNJmcF9pbCuvlbA1bj0kDqhu5mWA7eJqGmJ9kapMt42C00gX7Ued0nd1irGlVr0aoBj2X7PageNbTZCoaoK9wxbKupqowUa7oNyWJZrTQ3TLawGUsGqD37EE6iMeh6z3SMwtaPHMfMqUC/eerFq5b1qGXaIBRP4QBGB2G6oSZMBnrlw5DZkgvYNTz7oDeogFGCkefd3ovITmutSulFuOKqoh+kZScQt9aMbKoijigT5HVpdmRDuOFo/+cg7HVLqN/Zsr4oirCrsgGYCZWBnZyopDCcdAevzP0uZZMIZ5xFFrLChqtOAohGlBIjxPJv2H8KszEsBWyl1IMwlkBxeXhMqFLxCMXCldURWhtmOuygwUroiKFF44iQH3bLue37npQHMLRikJN/3IWDCavsKA4hKP0gD67MlHwIipSPMJRQYQMKQJafy+QJYWvVZcSM4Wh/AOQ6434wVm1FI/HLSIonHu1mEQDitHjACBm8mNxbeKCdasyUYweB8i9rqfYRAOK1eMAsSt2s7jqQrGxPHuSgqH7ewMt/B/gnn91czz89gAAAABJRU5ErkJggg=='
];

let chorDaten = { type: 'FeatureCollection', features: [] };
window.chorDaten = chorDaten;

const markerListe = [];

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v11',
  center: [10.5, 51],
  zoom: 5
});

window.kneipenchorMap = map;

function holeWert(obj, keys) {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
      return obj[key];
    }
  }
  return '';
}

function parseBoolean(value) {
  if (value === true) return true;
  const normalisiert = String(value || '').trim().toLowerCase();
  return ['ja', 'true', '1', 'yes'].includes(normalisiert);
}

function parseGenres(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value)
    .split(',')
    .map((eintrag) => eintrag.trim())
    .filter(Boolean);
}

function hashText(value) {
  let hash = 0;
  const text = String(value || '');
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function normalisiereDaten(rohdaten) {
  return {
    type: 'FeatureCollection',
    features: (Array.isArray(rohdaten) ? rohdaten : [])
      .map((eintrag) => {
        const lat = parseFloat(String(holeWert(eintrag, [
          'lat', 'Lat', 'Latitude', 'latitude', 'Breitengrad'
        ])).replace(',', '.'));

        const lng = parseFloat(String(holeWert(eintrag, [
          'lng', 'Lng', 'lon', 'Lon', 'Longitude', 'longitude', 'Längengrad', 'Laengengrad'
        ])).replace(',', '.'));

        if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

        const bild = holeWert(eintrag, [
          'bild',
          'Bild',
          'logo',
          'Logo',
          'Foto hochladen',
          'Foto',
          'Chorbild',
          'Bild hochladen'
        ]);

        const genres = parseGenres(holeWert(eintrag, [
          'genres', 'Genres', 'Genre', 'Musikrichtung'
        ]));

        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          properties: {
            name: holeWert(eintrag, ['name', 'Name', 'Name des Chores', 'Name des Chors', 'Chorname', 'Chor']),
            stadt: holeWert(eintrag, ['stadt', 'Stadt', 'Ort']),
            bundesland: holeWert(eintrag, ['bundesland', 'Bundesland']),
            beschreibung: holeWert(eintrag, ['beschreibung', 'Beschreibung']),
            leitung: holeWert(eintrag, ['leitung', 'Leitung', 'Chorleitung']),
            saenger: holeWert(eintrag, ['saenger', 'Sänger*innenanzahl', 'Sänger', 'Saenger']),
            genres,
            aufnahmestopp: parseBoolean(holeWert(eintrag, ['aufnahmestopp', 'Aufnahmestopp'])),
            bild: bild,
            logo: bild,
            link: holeWert(eintrag, ['link', 'Link', 'Link zur Homepage', 'Website', 'Homepage'])
          }
        };
      })
      .filter(Boolean)
  };
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function pinIndexFuerChor(props, index) {
  const basis = props.name || `${props.stadt || ''}-${index}`;
  return hashText(basis) % pinImages.length;
}

function popupHtml(props) {
  const bildQuelle = props.logo || props.bild || '';
  const bildHtml = bildQuelle
    ? `<img class="chor-popup-img" src="${escapeHtml(bildQuelle)}" alt="${escapeHtml(props.name)}">`
    : '';

  const websiteHtml = props.link
    ? `<a class="chor-popup-btn" href="${escapeHtml(props.link)}" target="_blank" rel="noopener noreferrer">Zur Homepage</a>`
    : '';

  return `
    <div class="chor-popup">
      <div class="chor-popup-facts">
        ${bildHtml}
        <div class="chor-popup-text">
          <div class="chor-popup-title">${escapeHtml(props.name)}</div>
          <div class="chor-popup-desc">${escapeHtml(props.beschreibung)}</div>
        </div>
      </div>
      <hr class="chor-popup-line">
      <div class="chor-popup-leitung">Leitung: ${escapeHtml(props.leitung)}</div>
      <div class="chor-popup-stats">
        <div>
          <div class="label">Sänger*innenanzahl</div>
          <div class="value">${escapeHtml(props.saenger)}</div>
        </div>
        <div>
          <div class="label">Aufnahmestopp</div>
          <div class="value">${props.aufnahmestopp ? 'Ja' : 'Nein'}</div>
        </div>
      </div>
      ${websiteHtml}
    </div>
  `;
}

function entferneMarker() {
  markerListe.forEach((marker) => marker.remove());
  markerListe.length = 0;
}

function zeichneMarker(features) {
  entferneMarker();

  features.forEach((feature, index) => {
    const coords = feature.geometry.coordinates;
    const props = feature.properties;
    const pinPfad = pinImages[pinIndexFuerChor(props, index)];

    const el = document.createElement('div');
    el.className = 'marker';
    el.style.width = '46px';
    el.style.height = '60px';
    el.style.cursor = 'pointer';
    el.style.backgroundSize = 'contain';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.backgroundPosition = 'center';
    el.style.backgroundImage = `url(${pinPfad})`;

    const popup = new mapboxgl.Popup({ maxWidth: '360px' }).setHTML(popupHtml(props));

    const marker = new mapboxgl.Marker(el)
      .setLngLat(coords)
      .setPopup(popup)
      .addTo(map);

    markerListe.push(marker);
  });

  if (features.length > 0) {
    const bounds = new mapboxgl.LngLatBounds();
    features.forEach((feature) => bounds.extend(feature.geometry.coordinates));
    map.fitBounds(bounds, { padding: 60, maxZoom: 7 });
  }
}

function ladeDatenPerJsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = 'kneipenchorCallback_' + Date.now();

    window[callbackName] = (daten) => {
      delete window[callbackName];
      script.remove();
      resolve(daten);
    };

    const script = document.createElement('script');
    script.src = `${url}?callback=${callbackName}&_=${Date.now()}`;
    script.onerror = () => {
      delete window[callbackName];
      script.remove();
      reject(new Error('JSONP konnte nicht geladen werden.'));
    };

    document.body.appendChild(script);
  });
}

async function ladeKneipenchorDaten() {
  try {
    const rohdaten = await ladeDatenPerJsonp(MAP_DATA_URL);
    chorDaten = normalisiereDaten(rohdaten);
    window.chorDaten = chorDaten;

    const starteAnzeige = () => {
      zeichneMarker(chorDaten.features);
      document.dispatchEvent(new CustomEvent('chorDatenGeladen', { detail: chorDaten }));
    };

    if (map.loaded()) {
      starteAnzeige();
    } else {
      map.once('load', starteAnzeige);
    }
  } catch (error) {
    console.error('Fehler beim Laden der Chordaten:', error);
    const list = document.getElementById('choir-list');
    if (list) {
      list.innerHTML = '<p>Die Chordaten konnten leider nicht geladen werden.</p>';
    }
  }
}

ladeKneipenchorDaten();
