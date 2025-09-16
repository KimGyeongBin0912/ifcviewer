"use client"

import React, { useEffect, useRef, useState } from "react"
import "@/app/globals.css"
import dynamic from "next/dynamic"
import { IFC_TYPES, getIfcTypeInfo, getAllIfcTypes } from "@/lib/ifc-types"

type IfcProps = Record<string, any>

const IFCViewer = dynamic(() => Promise.resolve(IFCViewerComponent), {
  ssr: false,
})

function IFCViewerComponent() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>("")
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [loadingStep, setLoadingStep] = useState<string>("")
  const [props, setProps] = useState<IfcProps | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [totalElements, setTotalElements] = useState<number>(0)
  const [processedElements, setProcessedElements] = useState<number>(0)

  // Three.js refs
  const sceneRef = useRef<any>()
  const rendererRef = useRef<any>()
  const cameraRef = useRef<any>()
  const controlsRef = useRef<any>()
  const ifcApiRef = useRef<any>()
  const modelRef = useRef<any | null>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null
    setFile(selectedFile)
    if (selectedFile) {
      const fileSizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2)
      setMessage(`파일 선택됨: ${selectedFile.name} (${fileSizeMB}MB)`)
    } else {
      setMessage("")
    }
  }

  useEffect(() => {
    const initThreeJS = async () => {
      try {
        console.log("[v0] Initializing Three.js and web-ifc...")
        const THREE = await import("three")
        const { OrbitControls } = await import("https://unpkg.com/three@0.144.0/examples/jsm/controls/OrbitControls.js")
        const { IfcAPI } = await import("web-ifc")

        if (!containerRef.current) {
          console.log("[v0] Container not ready, retrying...")
          setTimeout(initThreeJS, 100)
          return
        }

        const container = containerRef.current

        const ifcApi = new IfcAPI()
        ifcApi.SetWasmPath("https://cdn.jsdelivr.net/npm/web-ifc@0.0.57/")
        await ifcApi.Init()
        ifcApiRef.current = ifcApi

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x0b0b0c)
        sceneRef.current = scene

        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
        camera.position.set(10, 10, 10)
        cameraRef.current = camera

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(container.clientWidth, container.clientHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        rendererRef.current = renderer

        container.appendChild(renderer.domElement)

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.05
        controlsRef.current = controls

        const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0)
        hemi.position.set(0, 200, 0)
        scene.add(hemi)

        const dir = new THREE.DirectionalLight(0xffffff, 0.6)
        dir.position.set(50, 100, -50)
        dir.castShadow = true
        scene.add(dir)

        const grid = new THREE.GridHelper(100, 100, 0x2a2a2d, 0x2a2a2d)
        ;(grid.material as any).opacity = 0.3
        ;(grid.material as any).transparent = true
        scene.add(grid)

        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate)
          controls.update()
          renderer.render(scene, camera)
        }
        animate()

        // Handle resize
        const handleResize = () => {
          const width = container.clientWidth
          const height = container.clientHeight
          camera.aspect = width / height
          camera.updateProjectionMatrix()
          renderer.setSize(width, height)
        }
        window.addEventListener("resize", handleResize)

        console.log("[v0] Three.js and web-ifc initialized successfully")
        setMessage("")
      } catch (error) {
        console.error("[v0] Failed to initialize Three.js:", error)
        setMessage("3D 뷰어 초기화 실패")
      }
    }

    initThreeJS()

    return () => {
      // Cleanup
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
    }
  }, [])

  const onLoadIfc = async () => {
    if (!file || !ifcApiRef.current) return
    setLoading(true)
    setUploadProgress(0)
    setProps(null)
    setSelectedId(null)
    setTotalElements(0)
    setProcessedElements(0)

    try {
      console.log("[v0] Loading IFC file:", file.name)

      setLoadingStep("파일 읽는 중...")
      setMessage("파일을 메모리로 읽고 있습니다...")

      const arrayBuffer = await file.arrayBuffer()
      setUploadProgress(25)

      setLoadingStep("IFC 데이터 파싱 중...")
      setMessage("IFC 구조를 분석하고 있습니다...")

      const ifcData = new Uint8Array(arrayBuffer)
      const modelID = ifcApiRef.current.OpenModel(ifcData)
      console.log("[v0] Model opened with ID:", modelID)
      setUploadProgress(50)

      const THREE = await import("three")

      setLoadingStep("3D 지오메트리 생성 중...")
      setMessage("3D 모델을 생성하고 있습니다...")

      const group = new THREE.Group()
      let geometryCount = 0

      const allTypes = getAllIfcTypes()

      let totalElementCount = 0
      for (const ifcType of allTypes) {
        try {
          const expressIds = ifcApiRef.current.GetLineIDsWithType(modelID, ifcType)
          totalElementCount += expressIds.size()
        } catch (error) {
          // 타입이 존재하지 않는 경우 무시
        }
      }
      setTotalElements(totalElementCount)

      console.log(`[v0] Processing IFC types: ${allTypes.length}, Total elements: ${totalElementCount}`)

      for (const ifcType of allTypes) {
        try {
          const expressIds = ifcApiRef.current.GetLineIDsWithType(modelID, ifcType)
          const typeInfo = getIfcTypeInfo(ifcType)
          console.log(`[v0] Found ${expressIds.size()} elements of type ${typeInfo?.name || ifcType}`)

          for (let i = 0; i < expressIds.size(); i++) {
            const expressId = expressIds.get(i)

            try {
              const flatMesh = ifcApiRef.current.GetFlatMesh(modelID, expressId)

              for (let j = 0; j < flatMesh.geometries.size(); j++) {
                const placedGeometry = flatMesh.geometries.get(j)
                const geometry = ifcApiRef.current.GetGeometry(modelID, placedGeometry.geometryExpressID)

                const verts = ifcApiRef.current.GetVertexArray(geometry.GetVertexData(), geometry.GetVertexDataSize())
                const indices = ifcApiRef.current.GetIndexArray(geometry.GetIndexData(), geometry.GetIndexDataSize())

                if (verts.length > 0 && indices.length > 0) {
                  const bufferGeometry = new THREE.BufferGeometry()
                  bufferGeometry.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3))
                  bufferGeometry.setIndex(new THREE.Uint32BufferAttribute(indices, 1))
                  bufferGeometry.computeVertexNormals()

                  // 변환 행렬 적용
                  const matrix = new THREE.Matrix4()
                  const matrixArray = placedGeometry.flatTransformation
                  matrix.fromArray([
                    matrixArray[0],
                    matrixArray[1],
                    matrixArray[2],
                    matrixArray[3],
                    matrixArray[4],
                    matrixArray[5],
                    matrixArray[6],
                    matrixArray[7],
                    matrixArray[8],
                    matrixArray[9],
                    matrixArray[10],
                    matrixArray[11],
                    matrixArray[12],
                    matrixArray[13],
                    matrixArray[14],
                    matrixArray[15],
                  ])
                  bufferGeometry.applyMatrix4(matrix)

                  const color = typeInfo?.color || 0x888888

                  const material = new THREE.MeshLambertMaterial({
                    color: color,
                    side: THREE.DoubleSide,
                  })

                  const mesh = new THREE.Mesh(bufferGeometry, material)
                  mesh.userData = { expressId, ifcType, typeName: typeInfo?.name || "알 수 없음" }
                  group.add(mesh)
                  geometryCount++
                }
              }

              setProcessedElements((prev) => prev + 1)
            } catch (elementError) {
              console.warn(`[v0] Failed to process element ${expressId}:`, elementError)
            }
          }
        } catch (typeError) {
          console.warn(`[v0] Failed to process type ${ifcType}:`, typeError)
        }

        // 진행률 업데이트
        const progress = 50 + ((allTypes.indexOf(ifcType) + 1) / allTypes.length) * 40
        setUploadProgress(Math.round(progress))
        setMessage(`3D 모델 생성 중... (${geometryCount}개 요소 처리됨)`)
      }

      console.log(`[v0] Total geometries created: ${geometryCount}`)

      if (modelRef.current) {
        sceneRef.current.remove(modelRef.current)
      }
      sceneRef.current.add(group)
      modelRef.current = group

      setLoadingStep("카메라 조정 중...")
      setMessage("최적의 뷰로 조정하고 있습니다...")

      // Fit camera to model
      const box = new THREE.Box3().setFromObject(group)
      const size = new THREE.Vector3()
      const center = new THREE.Vector3()
      box.getSize(size)
      box.getCenter(center)

      if (size.length() > 0) {
        const maxDim = Math.max(size.x, size.y, size.z)
        const distance = maxDim * 1.5
        cameraRef.current.position.set(center.x + distance, center.y + distance * 0.5, center.z + distance)
        cameraRef.current.lookAt(center)
        controlsRef.current.target.copy(center)
        controlsRef.current.update()
      } else {
        // 기본 카메라 위치
        cameraRef.current.position.set(10, 10, 10)
        cameraRef.current.lookAt(0, 0, 0)
        controlsRef.current.target.set(0, 0, 0)
        controlsRef.current.update()
      }

      setUploadProgress(100)
      setLoadingStep("완료")
      setMessage(`로딩 완료! ${geometryCount}개의 3D 요소가 로드되었습니다.`)
    } catch (error) {
      console.error("[v0] Failed to load IFC:", error)
      setMessage("로딩 실패: " + (error as Error).message)
      setLoadingStep("오류")
      setUploadProgress(0)
    } finally {
      setLoading(false)
      setTimeout(() => {
        setUploadProgress(0)
        setLoadingStep("")
      }, 3000)
    }
  }

  const onClick = async (event: React.MouseEvent) => {
    console.log("[v0] Canvas clicked")
    if (!modelRef.current || !ifcApiRef.current) return

    try {
      const THREE = await import("three")
      const rect = (event.target as HTMLElement).getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera({ x, y }, cameraRef.current)

      const intersects = raycaster.intersectObject(modelRef.current, true)

      if (intersects.length > 0) {
        const mesh = intersects[0].object
        const mockProps = {
          "요소 타입": mesh.userData.typeName || "IFC 요소",
          "Express ID": mesh.userData.expressId || "알 수 없음",
          위치: `X: ${mesh.position.x.toFixed(2)}, Y: ${mesh.position.y.toFixed(2)}, Z: ${mesh.position.z.toFixed(2)}`,
          크기: `${intersects[0].distance.toFixed(2)}m 거리`,
          재질: mesh.material ? "표준 재질" : "기본 재질",
          "면 개수": mesh.geometry ? (mesh.geometry as any).attributes.position.count / 3 : "알 수 없음",
        }

        setProps(mockProps)
        setSelectedId(mesh.userData.expressId || Math.floor(Math.random() * 1000))

        // 선택된 요소 하이라이트
        if (mesh.material) {
          const originalColor = (mesh.material as any).color?.clone()
          ;(mesh.material as any).color = new THREE.Color(0xff6b35)

          // 2초 후 원래 색상으로 복원
          setTimeout(() => {
            if (originalColor) {
              ;(mesh.material as any).color = originalColor
            }
          }, 2000)
        }

        console.log("[v0] Element selected:", mockProps)
      } else {
        setProps(null)
        setSelectedId(null)
        console.log("[v0] No element selected")
      }
    } catch (error) {
      console.error("[v0] Click handling error:", error)
    }
  }

  return (
    <div className="container">
      <div className="left">
        <div className="toolbar">
          <label className="label-btn">
            <input type="file" accept=".ifc" onChange={handleFileSelect} />
            IFC 파일 선택
          </label>
          <button onClick={onLoadIfc} disabled={!file || loading}>
            {loading ? "로딩 중..." : "생성"}
          </button>
          {loading && uploadProgress > 0 && (
            <div style={{ marginLeft: 8, display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 100,
                  height: 4,
                  backgroundColor: "#333",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${uploadProgress}%`,
                    height: "100%",
                    backgroundColor: "#4CAF50",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <span className="small">{uploadProgress}%</span>
            </div>
          )}
        </div>
        {loadingStep && (
          <div style={{ padding: "8px 16px", backgroundColor: "#1a1a1a", borderRadius: 4, margin: "8px 0" }}>
            <div className="small" style={{ color: "#4CAF50", fontWeight: "bold" }}>
              {loadingStep}
            </div>
          </div>
        )}
        {message && (
          <div style={{ padding: "8px 16px", backgroundColor: "#1a1a1a", borderRadius: 4, margin: "8px 0" }}>
            <span className="small">{message}</span>
          </div>
        )}
        {totalElements > 0 && (
          <div style={{ padding: "8px 16px", backgroundColor: "#1a1a1a", borderRadius: 4, margin: "8px 0" }}>
            <div className="small" style={{ color: "#4CAF50" }}>
              📊 IFC 요소 현황: {processedElements}/{totalElements} 개 처리됨
            </div>
            <div className="small" style={{ color: "#888", marginTop: 4 }}>
              지원 타입: {IFC_TYPES.length}개 | 변환율:{" "}
              {totalElements > 0 ? Math.round((processedElements / totalElements) * 100) : 0}%
            </div>
          </div>
        )}
      </div>
      <div className="right">
        <div ref={containerRef} className="canvas" onClick={onClick} style={{ width: "100%", height: "400px" }} />
        <div className="panel">
          <div className="flex" style={{ justifyContent: "space-between" }}>
            <h3>선택 정보</h3>
            <span className="badge">{selectedId ? `ID: ${selectedId}` : "미선택"}</span>
          </div>
          <hr />
          {!props && <div className="small">3D에서 요소를 클릭하면 상세 정보 표시</div>}
          {props && (
            <div className="kv">
              {Object.entries(props).map(([k, v]) => (
                <React.Fragment key={k}>
                  <div>{k}</div>
                  <div style={{ color: "#ddd", wordBreak: "break-all" }}>{String((v as any)?.value ?? v)}</div>
                </React.Fragment>
              ))}
            </div>
          )}
          <hr />
          <div className="small">
            • 마우스: 드래그 회전 / 휠 확대 / 우클릭 이동
            <br />• 요소 클릭: 하이라이트 + 속성 보기
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return <IFCViewer />
}
